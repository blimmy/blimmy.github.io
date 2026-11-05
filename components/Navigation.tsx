"use client";
import { useEffect, useState } from "react";
import { ArrowDownToLine, Menu, X, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
const links = [
  ["about", "Overview"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["achievements", "Achievements"],
  ["contact", "Contact"],
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => observer.observe(el));
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", escape);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <header className="site-header">
      <a
        className="brand"
        href="/#home"
        aria-label="blimmy home"
        onClick={() => setOpen(false)}
      >
        blimmy<span aria-hidden="true">✳</span>
      </a>
      <span className="header-caption mono">SECURITY / SYSTEMS / PEOPLE</span>
      <nav
        aria-label="Main navigation"
        id="main-navigation"
        className={open ? "nav-links is-open" : "nav-links"}
      >
        {links.map(([id, label]) => (
          <a
            key={id}
            href={`/#${id}`}
            aria-current={active === id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
            <ArrowUpRight size={13} />
          </a>
        ))}
        <a className="nav-resume" href={profile.resume} download>
          Resume <ArrowDownToLine size={14} />
        </a>
      </nav>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
