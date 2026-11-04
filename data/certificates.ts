export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  category: string;
  date: string | null;
  image: string | null;
  related: string;
  verificationUrl: string | null;
  credentialId: string | null;
  visible: boolean;
  order: number;
};
// Training titles are from the resume. Images, dates, and IDs are intentionally pending.
export const certificates: Certificate[] = [
  {
    id: "ncsa-foundation",
    title: "Thailand Cyber Security Foundation Course",
    issuer: "NCSA",
    category: "Security",
    date: null,
    image: null,
    related: "Cybersecurity foundation training",
    verificationUrl: null,
    credentialId: null,
    visible: true,
    order: 1,
  },
  {
    id: "basic-security",
    title: "Basic Security Course",
    issuer: "SecPlayground",
    category: "Security",
    date: null,
    image: null,
    related: "Security training",
    verificationUrl: null,
    credentialId: null,
    visible: true,
    order: 2,
  },
  {
    id: "basic-pentest",
    title: "Basic Pentest",
    issuer: "SecPlayground",
    category: "Pentesting",
    date: null,
    image: null,
    related: "Penetration testing training",
    verificationUrl: null,
    credentialId: null,
    visible: true,
    order: 3,
  },
  {
    id: "cisco-networking",
    title: "Networking Basics & Ethical Hacking",
    issuer: "Cisco Networking Academy",
    category: "Networking",
    date: null,
    image: null,
    related:
      "Networking and ethical hacking training (grouped as listed in resume)",
    verificationUrl: null,
    credentialId: null,
    visible: true,
    order: 4,
  },
];
