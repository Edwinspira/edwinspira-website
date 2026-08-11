export type HomeWhatIDoCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Longer copy shown in the expanded Codrops-style detail view. */
  body: string;
  highlights: readonly string[];
  workHref: string;
  workLabel: string;
  borderSrc: string;
  /** When set, renders the SVG HUD frame instead of the border PNG. */
  borderVariant?: "hud";
  accent: string;
};

export const HOME_WHAT_I_DO_CARDS: HomeWhatIDoCard[] = [
  {
    id: "software-engineer",
    title: "SOFTWARE ENGINEER",
    subtitle: "開発",
    description:
      "Building custom software and websites tailored to businesses and creators.",
    body: "I design and ship custom software and websites for businesses and creators — from product architecture to polished front-end systems that feel as considered as they perform.",
    highlights: ["Next.js / TypeScript", "Product systems", "Custom websites"],
    workHref: "/work?category=software",
    workLabel: "View software work",
    borderSrc: "/images/home/SoftwareBorder|5ab160.png",
    borderVariant: "hud",
    accent: "#5ab160",
  },
  {
    id: "visual-artist",
    title: "VISUAL ARTIST",
    subtitle: "アート",
    description:
      "Creating traditional, digital, and 3D artwork, logos, branding and visual identities.",
    body: "Traditional, digital, and 3D work spanning logos, branding, and visual identities. Every mark is treated as a system — color, form, and story working as one.",
    highlights: ["Branding", "Digital illustration", "Visual identity"],
    workHref: "/work?category=art",
    workLabel: "View art work",
    borderSrc: "/images/home/ArtBorder|cb3c37.png",
    borderVariant: "hud",
    accent: "#cb3c37",
  },
  {
    id: "photographer",
    title: "PHOTOGRAPHER",
    subtitle: "写真",
    description:
      "Capturing timeless imagery through thoughtful composition, natural light, and authentic storytelling.",
    body: "Timeless imagery through composition, natural light, and authentic storytelling — portraits, environments, and stills that hold a moment still.",
    highlights: ["Natural light", "Portraiture", "Editorial stills"],
    workHref: "/work?category=art",
    workLabel: "View related work",
    borderSrc: "/images/home/ArtBorder|cb3c37.png",
    borderVariant: "hud",
    accent: "#d4a828",
  },
  {
    id: "video-editor",
    title: "VIDEO EDITOR",
    subtitle: "ビデオ",
    description:
      "Producing polished videos that combine seamless editing, pacing, and compelling storytelling.",
    body: "Polished videos with pacing, rhythm, and narrative. I cut for emotion first, then refine motion, sound, and color until the story lands.",
    highlights: ["Story pacing", "Color & sound", "Motion cuts"],
    workHref: "/work?category=video",
    workLabel: "View video work",
    borderSrc: "/images/home/VideoBorder|a382b6.png",
    borderVariant: "hud",
    accent: "#a382b6",
  },
  {
    id: "3d-sculptor",
    title: "3D SCULPTOR",
    subtitle: "3D / ビジュアル",
    description:
      "Sculpting high quality 3D models for art, collectibles, games, and digital experiences.",
    body: "High-quality 3D models for art, collectibles, games, and digital experiences — sculpted with intention from silhouette to surface detail.",
    highlights: ["Digital sculpture", "Collectibles", "Game-ready form"],
    workHref: "/work?category=sculpture3d",
    workLabel: "View 3D work",
    borderSrc: "/images/home/3DBorder|5784c0.png",
    borderVariant: "hud",
    accent: "#5784c0",
  },
];
