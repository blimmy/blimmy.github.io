import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { registerScrollController } from "./scroll-controller";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function startCinematicMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add(
    "(min-width: 1000px) and (min-height: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      // Navigation can finish before the optional engine arrives. Preserve the
      // visible section when pin spacers change the height above the reader.
      const initialScroll = window.scrollY;
      const readingSection = Array.from(
        document.querySelectorAll<HTMLElement>("main > section"),
      ).find((section) => section.getBoundingClientRect().bottom > innerHeight / 2);
      const readingTop = readingSection?.getBoundingClientRect().top ?? 0;
      document.documentElement.dataset.cinematic = "true";
      const lenis = new Lenis({
        lerp: 0.14,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        // The handler below owns anchors, including focus and URL updates.
        anchors: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Only promote the surfaces that actually move. The scene itself must
      // stay untransformed so ScrollTrigger's fixed pin remains stable.
      gsap.set(".hero-title, .hero-orb, .hero-bottom, .project-track", {
        force3D: true,
      });
      const hero = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: () => `+=${Math.min(680, window.innerHeight * 0.7)}`,
          pin: true,
          // Lenis already eases the scroll: a second scrub delay feels heavy.
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      hero
        .to(
          ".hero-title",
          {
            scale: 1.1,
            xPercent: 0,
            yPercent: -4,
            ease: "none",
            duration: 1,
          },
          0,
        )
        .to(
          ".hero-orb",
          { y: -65, rotation: 18, ease: "none", duration: 1 },
          0,
        )
        // Opacity composites a static background instead of repainting the
        // full viewport with a different background color on every frame.
        .to(".hero-shade", { opacity: 1, ease: "none", duration: 0.7 }, 0.15)
        .set(".hero", { color: "#F1F0EC" }, 0.5)
        .set(
          ".hero-title .dot, .hero-intro .pink, .hero-note > svg",
          { color: "#E8B8D0" },
          0.5,
        )
        .to(".hero-bottom", { y: -12, ease: "none", duration: 1 }, 0);

      gsap.fromTo(
        ".identity-statement",
        { x: 24 },
        {
          x: 0,
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            end: "top 25%",
            scrub: true,
          },
        },
      );
      gsap.utils.toArray<HTMLElement>(".achievement-row").forEach((row) => {
        gsap.fromTo(
          row.querySelector(".achievement-rank"),
          { y: 18 },
          {
            y: 0,
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              end: "top 45%",
              scrub: true,
            },
          },
        );
      });
      const track = document.querySelector<HTMLElement>(".project-track");
      const viewport =
        document.querySelector<HTMLElement>(".project-viewport");
      const panels = Array.from(
        track?.querySelectorAll<HTMLElement>(".project-panel") ?? [],
      );
      const distance = () =>
        Math.max(0, (track?.scrollWidth ?? 0) - (viewport?.clientWidth ?? 0));
      if (track && viewport && panels.length > 1) {
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            id: "project-gallery",
            trigger: ".project-scene",
            start: "top 70px",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
      const panelScroll = (panel: HTMLElement) => {
        const trigger = ScrollTrigger.getById("project-gallery");
        if (!trigger || !panels.length) return null;
        const travel = distance();
        const offset = Math.min(
          travel,
          Math.max(0, panel.offsetLeft - panels[0].offsetLeft),
        );
        return (
          trigger.start +
          (trigger.end - trigger.start) * (travel ? offset / travel : 0)
        );
      };
      const unregister = registerScrollController({
        moveProject(direction) {
          const positions = panels.map(panelScroll);
          if (!positions.length || positions.some((p) => p === null)) return;
          const targets = positions as number[];
          const nearest = targets.reduce(
            (best, target, i) =>
              Math.abs(target - lenis.targetScroll) <
              Math.abs(targets[best] - lenis.targetScroll)
                ? i
                : best,
            0,
          );
          const next = Math.max(
            0,
            Math.min(targets.length - 1, nearest + direction),
          );
          lenis.scrollTo(targets[next], { duration: 0.65, easing: easeOut });
        },
      });

      gsap.fromTo(
        ".contact-title",
        { xPercent: -3 },
        {
          xPercent: 0,
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "top 25%",
            scrub: true,
          },
        },
      );
      // Pin spacers change document height synchronously; update the scroll
      // limit before the first navigation can clamp to the old page height.
      ScrollTrigger.refresh();
      lenis.resize();
      if (initialScroll > 0 && readingSection && readingSection.id !== "home") {
        const shift = readingSection.getBoundingClientRect().top - readingTop;
        lenis.scrollTo(window.scrollY + shift, { immediate: true, force: true });
      }
      const onAnchor = (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const anchor = (event.target as Element).closest<HTMLAnchorElement>(
          "a[href]",
        );
        if (
          !anchor ||
          anchor.hasAttribute("download") ||
          (anchor.target && anchor.target !== "_self")
        )
          return;
        const url = new URL(anchor.href);
        if (
          url.origin !== location.origin ||
          url.pathname !== location.pathname ||
          !url.hash
        )
          return;
        let id: string;
        try {
          id = decodeURIComponent(url.hash.slice(1));
        } catch {
          return;
        }
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        // Lenis respects the existing CSS scroll-padding; no duplicate offset.
        lenis.scrollTo(target, {
          duration: 0.85,
          easing: easeOut,
          onComplete: () => {
            history.replaceState(null, "", url.hash);
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          },
        });
      };
      document.addEventListener("click", onAnchor);

      let pointerFocus = false;
      let pointerTimer: ReturnType<typeof setTimeout>;
      const onPointerDown = () => {
        pointerFocus = true;
        clearTimeout(pointerTimer);
        pointerTimer = setTimeout(() => {
          pointerFocus = false;
        }, 0);
      };
      document.addEventListener("pointerdown", onPointerDown, {
        passive: true,
      });
      const focusProject = (event: FocusEvent) => {
        if (pointerFocus || !viewport) return;
        const target = event.target as HTMLElement;
        const panel = target.closest<HTMLElement>(".project-panel");
        if (!panel) return;
        const bounds = target.getBoundingClientRect();
        const frame = viewport.getBoundingClientRect();
        if (bounds.left >= frame.left - 1 && bounds.right <= frame.right + 1)
          return;
        const destination = panelScroll(panel);
        if (destination !== null)
          lenis.scrollTo(destination, { immediate: true });
      };
      track?.addEventListener("focusin", focusProject);

      // Filters and disclosure controls can change section heights. Refresh
      // once after layout changes, never from the per-frame scroll handler.
      let refreshTimer: ReturnType<typeof setTimeout>;
      const refresh = () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          ScrollTrigger.refresh();
          lenis.resize();
        }, 120);
      };
      const observer = new ResizeObserver(refresh);
      document
        .querySelectorAll<HTMLElement>("main > section")
        .forEach((section) => observer.observe(section));
      let disposed = false;
      document.fonts.ready.then(() => {
        if (!disposed) refresh();
      });
      return () => {
        disposed = true;
        observer.disconnect();
        clearTimeout(refreshTimer);
        clearTimeout(pointerTimer);
        unregister();
        delete document.documentElement.dataset.cinematic;
        document.removeEventListener("click", onAnchor);
        document.removeEventListener("pointerdown", onPointerDown);
        track?.removeEventListener("focusin", focusProject);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    },
  );
  return () => mm.revert();
}
