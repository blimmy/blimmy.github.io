import {
  ArrowDown,
  ArrowUpRight,
  ArrowDownToLine,
  Asterisk,
  Github,
  Mail,
} from "lucide-react";
import { profile } from "@/data/profile";
import { achievements } from "@/data/achievements";
import { experience } from "@/data/experience";
import { visible } from "@/lib/content";
import Navigation from "@/components/Navigation";
import MotionSystem from "@/components/MotionSystem";
import Orb from "@/components/Orb";
import Terminal from "@/components/Terminal";
import Certificates from "@/components/Certificates";
import ResearchArchive from "@/components/ResearchArchive";
import ProjectGallery from "@/components/ProjectGallery";
import Skills from "@/components/Skills";
import "./portfolio.css";
export default function Home() {
  const records = visible(achievements);
  const featured = records.find((a) => a.id === "tctt");
  const internship = visible(experience).find((e) => e.id === "acis");
  return (
    <>
      <Navigation />
      <main id="main" className="profile-home">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-topline mono">
            <span>
              <i className="status-dot" /> PERSONAL PORTFOLIO / 2026
            </span>
            <span>{profile.location}</span>
          </div>
          <div className="hero-profile">
            <div className="hero-intro">
              <h1 className="hero-title" id="hero-title">
                <span className="hero-greeting">hi, my name is</span>{" "}
                <span className="hero-name">blimmy</span>
              </h1>
              <p className="hero-full-name">{profile.name}</p>
              <p className="hero-role">{profile.headline}</p>
              <p className="hero-summary">{profile.summary}</p>
              <div className="hero-actions">
                <a
                  className="pill-link primary-action"
                  href={profile.resume}
                  download
                >
                  Download resume <span className="resume-format">PNG</span>
                  <ArrowDownToLine size={17} />
                </a>
                <a className="pill-link" href="#experience">
                  View experience <ArrowDown size={17} />
                </a>
                <a className="hero-email" href={`mailto:${profile.email}`}>
                  <Mail size={17} />
                  {profile.email}
                </a>
              </div>
            </div>
            <div className="hero-bottom">
              <div className="hero-orb">
                <Orb />
              </div>
              <div className="hero-note">
                <Asterisk size={28} strokeWidth={1.25} />
                <span className="eyebrow">CAREER INTERESTS</span>
                <p>{profile.focus}</p>
              </div>
            </div>
          </div>
          <div className="hero-baseline mono">
            <span>
              {profile.education.degree} / {profile.education.graduation}
            </span>
            <a href="#about">
              QUICK OVERVIEW <ArrowDown size={14} />
            </a>
          </div>
        </section>
        <section
          className="identity section-pad"
          id="about"
          aria-labelledby="overview-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / PROFILE OVERVIEW</span>
              <h2 className="identity-statement" id="overview-title">
                The short <span className="serif">version.</span>
              </h2>
            </div>
            <div className="overview-links">
              <a className="text-link" href="#projects">
                Selected projects <ArrowUpRight size={16} />
              </a>
              <a className="text-link" href="#skills">
                Skills & tools <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="overview-grid">
            {internship && (
              <article className="overview-card">
                <span className="eyebrow">PROFESSIONAL EXPERIENCE</span>
                <h3>{internship.role}</h3>
                <p>{internship.organization}</p>
                <p className="overview-detail">
                  Building a web application for auditors and translating
                  consultant needs into application features.
                </p>
                <a className="text-link" href="#experience">
                  View experience <ArrowUpRight size={16} />
                </a>
              </article>
            )}
            <article className="overview-card">
              <span className="eyebrow">
                EDUCATION / {profile.education.graduation}
              </span>
              <h3>{profile.education.degree}</h3>
              <p>{profile.education.institution}</p>
              <details>
                <summary>
                  Relevant coursework <span>+</span>
                </summary>
                <ul>
                  {profile.education.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </details>
            </article>
            {featured && (
              <article className="overview-card overview-award">
                <span className="eyebrow">
                  COMPETITION HIGHLIGHT / {featured.year}
                </span>
                <h3>{featured.placement}</h3>
                <p>{featured.title}</p>
                <p className="overview-detail">{featured.category}</p>
                <a className="text-link" href="#achievements">
                  View achievements <ArrowUpRight size={16} />
                </a>
              </article>
            )}
          </div>
          <details className="overview-about">
            <summary>
              More about me <span>+</span>
            </summary>
            <p>{profile.about}</p>
          </details>
        </section>
        <section className="experience section-pad" id="experience">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / EXPERIENCE & LEADERSHIP</span>
              <h2>
                Experience &<br />
                <span className="serif">leadership.</span>
              </h2>
            </div>
            <p>
              Building useful tools.
              <br />
              Translating real needs.
              <br />
              Bringing people together.
            </p>
          </div>
          <div className="experience-list">
            {visible(experience).map((e, i) => (
              <article className="experience-row" key={e.id}>
                <div className="experience-date">
                  <span className="mono">{e.date}</span>
                  <span className="eyebrow">{e.category}</span>
                </div>
                <div>
                  <span className="mono experience-org">{e.organization}</span>
                  <h3>{e.role}</h3>
                  <ul>
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <span className="experience-counter mono">0{i + 1}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="projects-section section-pad" id="projects">
          <ProjectGallery />
        </section>
        <section className="achievements section-pad" id="achievements">
          <div className="section-heading">
            <div>
              <span className="eyebrow">05 / COMPETITIONS & RECOGNITION</span>
              <h2>
                Competition
                <br />
                <span className="serif">achievements.</span>
              </h2>
            </div>
            <p>
              Challenges entered.
              <br />
              Lessons earned.
              <br />A few moments that matter.
            </p>
          </div>
          {featured && (
            <div className="achievement-feature">
              <div className="award-display">
                <span className="mono">
                  {featured.title.toUpperCase()} / {featured.year}
                </span>
                <div className="award-number">
                  {featured.displayRank ?? featured.placement}
                  <span>{featured.rankSuffix}</span>
                  <Asterisk className="award-star" strokeWidth={1} />
                </div>
                <span className="award-caption">
                  {featured.category.toUpperCase()}
                </span>
                <span className="mono award-sub">
                  {featured.placement.toUpperCase()} / {featured.year}
                </span>
              </div>
              <div className="award-info">
                <span className="eyebrow">FEATURED RECOGNITION</span>
                <h3>
                  {featured.title} {featured.year}
                </h3>
                <p>{featured.description}</p>
                {featured.proof ? (
                  <a className="text-link" href={featured.proof}>
                    View certificate / proof <ArrowUpRight size={16} />
                  </a>
                ) : (
                  <span className="pending-label mono">
                    CERTIFICATE / PROOF PENDING
                  </span>
                )}
                {featured.url && (
                  <a
                    className="text-link"
                    href={featured.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Competition website <ArrowUpRight size={16} />
                  </a>
                )}
                <a href="#certificates" className="text-link">
                  Credentials archive <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          )}
          <div className="achievements-list">
            {records
              .filter((a) => a.id !== featured?.id)
              .map((a, i) => (
                <article
                  className={`achievement-row ${a.major ? "major" : ""}`}
                  key={a.id}
                >
                  <span className="achievement-year mono">
                    {a.year}
                    <span>/{String(i + 2).padStart(2, "0")}</span>
                  </span>
                  <div className="achievement-description">
                    <h3>{a.title}</h3>
                    <span className="mono">{a.category}</span>
                    <details>
                      <summary>
                        Record details <span>+</span>
                      </summary>
                      <p>{a.description}</p>
                      {a.proof ? (
                        <a href={a.proof}>View proof ↗</a>
                      ) : (
                        <p className="mono muted">
                          Proof / certificate pending.
                        </p>
                      )}
                      {a.url && (
                        <a href={a.url} target="_blank" rel="noreferrer">
                          Competition website ↗
                        </a>
                      )}
                    </details>
                  </div>
                  <span className="achievement-rank">{a.placement}</span>
                </article>
              ))}
          </div>
        </section>
        <section className="capabilities section-pad" id="skills">
          <div className="section-heading">
            <div>
              <span className="eyebrow">06 / SKILLS & TOOLS</span>
              <h2>
                Skills in
                <br />
                <span className="serif">practice.</span>
              </h2>
            </div>
            <p>
              Click a skill to explore its context.
              <br />
              Built through coursework,
              <br />
              projects, and competition.
            </p>
          </div>
          <Skills />
        </section>
        <section className="credentials section-pad" id="certificates">
          <div className="section-heading">
            <div>
              <span className="eyebrow">07 / TRAINING & CREDENTIALS</span>
              <h2>
                Certificates &<br />
                <span className="serif">training.</span>
              </h2>
            </div>
            <p>
              Training from my resume.
              <br />
              Original certificate images
              <br />
              will be added to the archive.
            </p>
          </div>
          <Certificates />
        </section>
        <section className="research dark section-pad" id="research">
          <div className="section-top mono">
            <span>08 / SECURITY RESEARCH</span>
            <span>
              <i className="status-dot" /> ARCHIVE INITIALIZING
            </span>
          </div>
          <div className="section-heading">
            <div>
              <h2>
                FIELD
                <br />
                <span className="outline">NOTES</span>
                <span className="pink">_</span>
              </h2>
            </div>
            <div className="research-intro">
              <span className="mono">[ PUBLIC RESEARCH DATABASE ]</span>
              <p>
                Follow the evidence.
                <br />
                Understand the exploit.
                <br />
                Document the lesson.
              </p>
              <span className="mono muted">
                CTF WRITEUPS / TECHNICAL INVESTIGATIONS
              </span>
            </div>
          </div>
          <ResearchArchive />
        </section>
        <section className="terminal-section dark section-pad" id="terminal">
          <div className="terminal-layout">
            <div>
              <span className="eyebrow">09 / EXPLORE A LITTLE MORE</span>
              <h2>
                Meet me
                <br />
                at the <span className="serif pink">prompt.</span>
              </h2>
              <p>
                Try a command or a shortcut below. You can also find everything
                in the sections above.
              </p>
              <a href="#contact" className="text-link">
                Get in touch <ArrowDown size={15} />
              </a>
              <div className="terminal-side-note mono">
                <span>01</span> NO SECRET HANDSHAKE REQUIRED.
                <br />
                JUST A LITTLE CURIOSITY.
              </div>
            </div>
            <Terminal />
          </div>
        </section>
        <section className="contact dark section-pad" id="contact">
          <div className="section-top mono">
            <span>10 / START A CONVERSATION</span>
            <span>END OF ARCHIVE. BEGINNING OF SOMETHING ELSE.</span>
          </div>
          <h2 className="contact-title">
            LET’S BUILD
            <br />
            SOMETHING<span className="pink">.</span>
            <ArrowUpRight aria-hidden="true" />
          </h2>
          <div className="contact-bottom">
            <div>
              <a className="contact-email" href={`mailto:${profile.email}`}>
                {profile.email}
                <ArrowUpRight />
              </a>
              <p>
                Cybersecurity. Systems. Better questions.
                <br />
                I’d love to hear what you’re working on.
              </p>
            </div>
            <div className="contact-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={18} />
                GitHub
                <ArrowUpRight size={18} />
              </a>
              {profile.linkedin ? (
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                  <ArrowUpRight size={18} />
                </a>
              ) : null}
              <a href={profile.resume} download>
                <ArrowDownToLine size={18} />
                Download resume
                <ArrowUpRight size={18} />
              </a>
              <a href={`mailto:${profile.email}`}>
                <Mail size={18} />
                Say hello
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <footer className="site-footer mono">
            <span>
              © {new Date().getFullYear()} BLIMMY / {profile.name}
            </span>
            <span className="pink">
              &gt; end_of_transmission<span className="terminal-caret">_</span>
            </span>
            <a href="#home">BACK TO TOP ↑</a>
          </footer>
        </section>
      </main>
      <MotionSystem />
    </>
  );
}
