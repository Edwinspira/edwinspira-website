export const siteConfig = {
  name: "Edwinspira",
  domain: "https://edwinspira.com",
  description:
    "Creative-tech portfolio showcasing software, art, video edits, and 3D sculpture.",
  tagline: "Software, art, motion, and form.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
