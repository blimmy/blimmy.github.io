"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Image as ImageIcon,
} from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/projects";
import { visible } from "@/lib/content";
function ProjectMedia({ project, index }: { project: Project; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`project-art art-${index}`}>
      {project.image && !failed ? (
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <div className="project-art-top mono">
            <span>PROJECT / 00{index + 1}</span>
            <span>TECHNICAL STUDY</span>
          </div>
          <div className="project-art-type">
            {project.shortTitle.split("\n").map((line, i) => (
              <span key={line}>
                {line}
                {i === 0 && <span className="art-asterisk">✳</span>}
              </span>
            ))}
          </div>
          <div className="project-art-bottom mono">
            <span>
              <ImageIcon size={13} /> SCREENSHOT PENDING
            </span>
            <span>{project.stack[0]}</span>
          </div>
        </>
      )}
    </div>
  );
}
export default function ProjectGallery() {
  const records = visible(projects);
  const move = (direction: number) => {
    const st = ScrollTrigger.getById("project-gallery");
    if (st) {
      const current = Math.round(st.progress * (records.length - 1));
      const next = Math.max(
        0,
        Math.min(records.length - 1, current + direction),
      );
      window.scrollTo({
        top: st.start + ((st.end - st.start) * next) / (records.length - 1),
        behavior: "instant",
      });
    } else {
      const panels = Array.from(
        document.querySelectorAll<HTMLElement>(".project-panel"),
      );
      const current = panels.findIndex(
        (p) => p.getBoundingClientRect().top >= 60,
      );
      panels[
        Math.max(
          0,
          Math.min(
            panels.length - 1,
            (current < 0 ? panels.length - 1 : current) + direction,
          ),
        )
      ]?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  };
  return (
    <div className="project-scene">
      <div className="section-heading project-heading">
        <div>
          <span className="eyebrow">07 / SELECTED PROJECTS</span>
          <h2>
            Built from
            <br />
            <span className="serif">the inside out.</span>
          </h2>
        </div>
        <div className="gallery-controls">
          <span className="mono">
            {String(records.length).padStart(2, "0")} SYSTEM STUDIES
          </span>
          <button
            className="icon-button"
            onClick={() => move(-1)}
            aria-label="Previous project"
          >
            <ArrowLeft />
          </button>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label="Next project"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className="project-viewport">
        <div className="project-track">
          {records.map((p, i) => (
            <article
              className="project-panel"
              key={p.id}
              id={p.id}
              tabIndex={0}
              aria-label={p.title}
            >
              <ProjectMedia project={p} index={i} />
              <div className="project-info">
                <span className="eyebrow">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.overview}</p>
                <p className="project-problem">{p.problem}</p>
                <div className="project-tags">
                  {p.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <details>
                  <summary>
                    Implementation & role <span>+</span>
                  </summary>
                  <p>{p.role}.</p>
                  <ul>
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <p>{p.outcome ?? "Outcome details pending."}</p>
                </details>
                <div className="project-links">
                  {p.github ? (
                    <a href={p.github} target="_blank" rel="noreferrer">
                      Repository <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className="mono muted">REPOSITORY LINK PENDING</span>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer">
                      Live demo <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
