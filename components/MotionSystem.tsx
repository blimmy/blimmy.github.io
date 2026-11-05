"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function MotionSystem() {
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const paused = !enabled || reducedMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion
      ? "reduced"
      : enabled
        ? "full"
        : "reading";
    if (paused) return;

    // Only load motion when the viewport can show the pinned content in full.
    const media = window.matchMedia(
      "(min-width: 1000px) and (min-height: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let generation = 0;
    let cleanup: (() => void) | undefined;
    const update = async () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (!media.matches) return;
      try {
        const { startCinematicMotion } = await import("@/lib/cinematic-motion");
        // A resize, pause, or unmount can happen while the chunk is in flight.
        if (current !== generation || !media.matches) return;
        cleanup = startCinematicMotion();
      } catch {
        // Native scrolling and the complete page remain usable if loading fails.
      }
    };
    void update();
    media.addEventListener("change", update);
    return () => {
      generation++;
      media.removeEventListener("change", update);
      cleanup?.();
    };
  }, [paused, enabled, reducedMotion]);
  return (
    <button
      className="motion-toggle mono"
      aria-pressed={!paused}
      onClick={() => setEnabled(!enabled)}
      disabled={reducedMotion}
      title={
        reducedMotion
          ? "Reduced motion follows your system preference"
          : paused
            ? "Explore with motion"
            : "Return to reading view"
      }
      aria-label="Toggle cinematic motion"
    >
      {paused ? <Play size={12} /> : <Pause size={12} />}
      <span>{paused ? "EXPLORE WITH MOTION" : "READING VIEW"}</span>
    </button>
  );
}
