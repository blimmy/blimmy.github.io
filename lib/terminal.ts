import { profile } from "@/data/profile";
import { achievements } from "@/data/achievements";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { certificates } from "@/data/certificates";
import { skills } from "@/data/skills";
import { visible } from "./content";
export const commands = [
  "help",
  "whoami",
  "ls",
  "skills",
  "achievements",
  "projects",
  "experience",
  "certificates",
  "contact",
  "clear",
  "cat resume.txt",
];
export function executeCommand(raw: string): string {
  const cmd = raw.trim().replace(/\s+/g, " ").toLowerCase();
  switch (cmd) {
    case "help":
      return (
        "AVAILABLE COMMANDS\n" +
        commands.map((c) => `  ${c}`).join("\n") +
        "\n\n↑ / ↓ history · Tab autocomplete · Ctrl+L clear\nPrefer browsing? Every section is available through normal navigation."
      );
    case "whoami":
      return `${profile.name}\n${profile.headline}\n${profile.location}\n\n${profile.introduction}`;
    case "ls":
      return "identity/     achievements/    projects/\nexperience/   certificates/    research/\nskills/       contact/         resume.txt";
    case "skills":
      return visible(skills)
        .map((s) => `${s.title}\n  ${s.items.join(" · ")}`)
        .join("\n\n");
    case "achievements":
      return visible(achievements)
        .map(
          (a) => `${a.year} | ${a.title}\n  ${a.placement} — ${a.description}`,
        )
        .join("\n\n");
    case "projects":
      return visible(projects)
        .map(
          (p) => `${p.title}\n  ${p.overview}\n  ${p.highlights.join(" · ")}`,
        )
        .join("\n\n");
    case "experience":
      return visible(experience)
        .map(
          (e) =>
            `${e.role} / ${e.organization}\n  ${e.date}\n  ${e.bullets.join("\n  ")}`,
        )
        .join("\n\n");
    case "certificates":
      return visible(certificates)
        .map(
          (c) =>
            `${c.title} / ${c.issuer}\n  ${c.image ? "Image available in credentials gallery" : "Certificate image pending"}`,
        )
        .join("\n\n");
    case "contact":
      return `Email: ${profile.email}\nGitHub: ${profile.github}\nLinkedIn: ${profile.linkedin ?? "URL pending"}\nResume: ${profile.resume}`;
    case "cat resume.txt":
      return [
        executeCommand("whoami"),
        `${profile.education.degree}\n${profile.education.institution}\n${profile.education.graduation}`,
        executeCommand("experience"),
        executeCommand("achievements"),
        executeCommand("projects"),
        executeCommand("skills"),
        executeCommand("certificates"),
        executeCommand("contact"),
      ].join("\n\n");
    case "clear":
      return "";
    case "":
      return "";
    default:
      return `Command not found: ${raw.trim().slice(0, 100)}\nType "help" to see the available commands.`;
  }
}
