export const categories = [
  "Web Exploitation",
  "Reverse Engineering",
  "Binary Exploitation / Pwn",
  "Digital Forensics",
  "Cryptography",
  "OSINT",
  "Network Security",
  "Miscellaneous",
] as const;
export type Writeup = {
  slug: string;
  title: string;
  competition: string | null;
  category: string;
  difficulty: string | null;
  technologies: string[];
  technique: string | null;
  summary: string;
  github: string | null;
  status: "published" | "template" | "draft";
  visible: boolean;
  order: number;
};
// Add published records only after their real technical content has been supplied.
export const writeups: Writeup[] = [
  {
    slug: "writeup-template",
    title: "Inside the investigation",
    competition: null,
    category: "Miscellaneous",
    difficulty: null,
    technologies: [],
    technique: null,
    summary:
      "The structure is ready. The research is coming. Preview the reusable technical writeup format.",
    github: null,
    status: "template",
    visible: true,
    order: 1,
  },
];
