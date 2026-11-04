export type Achievement = {
  id: string;
  title: string;
  year: string;
  placement: string;
  category: string;
  description: string;
  major?: boolean;
  displayRank?: string;
  rankSuffix?: string;
  proof?: string;
  url?: string;
  visible: boolean;
  order: number;
};
export const achievements: Achievement[] = [
  {
    id: "tctt",
    displayRank: "01",
    rankSuffix: "ST",
    title: "Thailand Cyber Top Talent",
    year: "2026",
    placement: "1st Place",
    category: "Senior category · Royal Trophy",
    description:
      "Royal Trophy recipient. Achieved the highest scores in both the qualifying and final rounds.",
    major: true,
    visible: true,
    order: 1,
  },
  {
    id: "sea",
    title: "Cyber SEA Game",
    year: "2026",
    placement: "Thailand representative",
    category: "International cyber competition",
    description:
      "Selected to represent Thailand in an international cyber competition.",
    major: true,
    visible: true,
    order: 2,
  },
  {
    id: "ncsa",
    title: "NCSA CTF Bootcamp",
    year: "2026",
    placement: "1st Place",
    category: "Central Region · CTF",
    description: "First place in the Central Region CTF competition.",
    major: true,
    visible: true,
    order: 3,
  },
  {
    id: "cube",
    title: "CubeCTF",
    year: "2026",
    placement: "4th Place",
    category: "Attack / Defense CTF",
    description: "Fourth place in the Attack/Defense competition.",
    visible: true,
    order: 4,
  },
  {
    id: "hackloween",
    title: "Hackloween by SECPlayground",
    year: "2026",
    placement: "6th Place",
    category: "CTF",
    description: "Sixth place in Hackloween 2026.",
    visible: true,
    order: 5,
  },
  {
    id: "huntress",
    title: "Huntress CTF",
    year: "2026",
    placement: "163 / 1,602",
    category: "Global CTF",
    description: "Ranked 163rd globally out of 1,602 teams.",
    visible: true,
    order: 6,
  },
  {
    id: "securinets",
    title: "Securinets CTF",
    year: "2026",
    placement: "Participation",
    category: "CTF",
    description: "Participated in Securinets CTF 2026.",
    visible: true,
    order: 7,
  },
  {
    id: "deadface",
    title: "DEADFACE CTF",
    year: "2026",
    placement: "Participation",
    category: "CTF",
    description: "Participated in DEADFACE CTF 2026.",
    visible: true,
    order: 8,
  },
  {
    id: "glo",
    title: "GLO Innovation Challenge",
    year: "2026",
    placement: "1st Place",
    category: "Innovation · Lot Loop",
    description:
      "Lot Loop: a kiosk for lottery ticket returns and recycling, with ticket printing functionality.",
    visible: true,
    order: 9,
  },
];
