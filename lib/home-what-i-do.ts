export type HomeWhatIDoService = {
  index: string;
  label: string;
};

export type HomeWhatIDoCard = {
  id: string;
  title: string;
  /** Optional stacked title lines for the expanded detail heading. */
  titleLines?: readonly string[];
  subtitle: string;
  /** Longer Japanese/category line used only in the expanded view. */
  detailsSubtitle?: string;
  description: string;
  /** Longer copy shown in the expanded Codrops-style detail view. */
  body: string;
  highlights: readonly string[];
  /** Spec-style category line shown near the expanded heading. */
  categoryLine?: string;
  services?: readonly HomeWhatIDoService[];
  servicesTitle?: string;
  note?: string;
  workHref: string;
  workLabel: string;
  projectHref?: string;
  projectLabel?: string;
  borderSrc: string;
  /** When set, renders the SVG HUD frame instead of the border PNG. */
  borderVariant?: "hud";
  accent: string;
};

export const HOME_WHAT_I_DO_CARDS: HomeWhatIDoCard[] = [
  {
    id: "software-engineer",
    title: "SOFTWARE ENGINEER",
    titleLines: ["SOFTWARE", "ENGINEER"],
    subtitle: "開発",
    detailsSubtitle: "開発 / DEVELOPMENT",
    description:
      "Building custom software and websites tailored to businesses and creators.",
    body: "I design and build custom software, websites, and digital systems. Ranging from polished customer experiences to the tools, integrations, and automation that power a business behind the scenes.",
    highlights: ["Custom websites", "Business systems", "Automation"],
    categoryLine: "CUSTOM SOFTWARE · WEB · AUTOMATION · AI",
    services: [
      { index: "01", label: "Custom Websites" },
      { index: "02", label: "Web Applications" },
      { index: "03", label: "Business Tools" },
      { index: "04", label: "Client Portals" },
      { index: "05", label: "AI Integrations" },
      { index: "06", label: "APIs & Automation" },
      { index: "07", label: "Data & Dashboards" },
      { index: "08", label: "Cloud Systems" },
    ],
    note: "Have something else in mind? Let's talk about it.",
    workHref: "/work?category=software",
    workLabel: "View software work",
    projectHref: "/#connect",
    projectLabel: "Start a Project",
    borderSrc: "/images/home/SoftwareBorder|5ab160.png",
    borderVariant: "hud",
    accent: "#5ab160",
  },
  {
    id: "visual-artist",
    title: "VISUAL ARTIST",
    subtitle: "アート",
    detailsSubtitle: "アート / ART",
    description:
      "Creating traditional and digital artwork, branding, illustration, and design for businesses and creators.",
    body: "I create traditional and digital artwork, branding, illustration, and design for businesses, creators, and individuals from visual identities and promotional graphics to custom artwork built around a specific idea, story, or purpose.",
    highlights: ["Branding", "Illustration", "Traditional art"],
    categoryLine: "BRANDING · DESIGN · ILLUSTRATION · ART",
    servicesTitle: "What I Create",
    services: [
      { index: "01", label: "Brand Identity & Logos" },
      { index: "02", label: "Graphic & Marketing Design" },
      { index: "03", label: "Custom Digital Illustrations" },
      { index: "04", label: "Traditional Art" },
      { index: "05", label: "Character & Concept Art" },
      { index: "06", label: "Packaging & Label Design" },
      { index: "07", label: "Merchandise & Apparel" },
      { index: "08", label: "Social Media & Ad Design" },
    ],
    note: "Have something else in mind? Let's talk about it.",
    workHref: "/work?category=art",
    workLabel: "View art work",
    projectHref: "/#connect",
    projectLabel: "Start a Project",
    borderSrc: "/images/home/ArtBorder|cb3c37.png",
    borderVariant: "hud",
    accent: "#cb3c37",
  },
  {
    id: "photographer",
    title: "PHOTOGRAPHER",
    subtitle: "写真",
    detailsSubtitle: "写真 / PHOTOGRAPHY",
    description:
      "Polished, intentional photography for people, events, and brands.",
    body: "I create polished, intentional photography for people, events, and brands, with a focus on natural moments, strong composition, and images that feel personal and lasting.",
    highlights: ["Portraits", "Events", "Editorial"],
    categoryLine: "PORTRAITS · EVENTS · COMMERCIAL · EDITORIAL",
    servicesTitle: "What I Photograph",
    services: [
      { index: "01", label: "Portrait Photography" },
      { index: "02", label: "Event Photography" },
      { index: "03", label: "Weddings & Couples" },
      { index: "04", label: "Graduation & Milestones" },
      { index: "05", label: "Product Photography" },
      { index: "06", label: "Brand & Commercial" },
      { index: "07", label: "Editorial & Lifestyle" },
      { index: "08", label: "Photo Retouching" },
    ],
    note: "Have something else in mind? Let's talk about it.",
    workHref: "/work?category=art",
    workLabel: "View photo work",
    projectHref: "/#connect",
    projectLabel: "Book a Shoot",
    borderSrc: "/images/home/ArtBorder|cb3c37.png",
    borderVariant: "hud",
    accent: "#d4a828",
  },
  {
    id: "video-editor",
    title: "VIDEO EDITOR",
    subtitle: "ビデオ",
    detailsSubtitle: "ビデオ / VIDEO EDITING",
    description:
      "Shaping raw footage into polished videos through editing, pacing, color, sound, and motion.",
    body: "I shape raw footage into polished, engaging videos through thoughtful editing, pacing, color, sound, and motion. From short form content to narrative and promotional work, every edit is built around the story and its audience.",
    highlights: ["Editing", "Color", "Sound"],
    categoryLine: "EDITING · COLOR · SOUND · MOTION",
    servicesTitle: "What I Edit",
    services: [
      { index: "01", label: "Commercial & Brand Videos" },
      { index: "02", label: "Social Media Content" },
      { index: "03", label: "Events & Highlight Films" },
      { index: "04", label: "Short Films & Narrative" },
      { index: "05", label: "Color Grading" },
      { index: "06", label: "Sound Design & Mixing" },
      { index: "07", label: "Motion Graphics & Titles" },
      { index: "08", label: "Trailers & Promotional Edits" },
    ],
    note: "Have something else in mind? Let's talk about it.",
    workHref: "/work?category=video",
    workLabel: "View video work",
    projectHref: "/#connect",
    projectLabel: "Start an Edit",
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
    highlights: ["Characters", "Collectibles", "Game-ready assets"],
    categoryLine: "CHARACTERS · PRODUCTS · COLLECTIBLES · ASSETS",
    servicesTitle: "What I Sculpt",
    services: [
      { index: "01", label: "Characters & Creatures" },
      { index: "02", label: "3D Printing Models" },
      { index: "03", label: "Product Visualizations" },
      { index: "04", label: "Game Ready Assets" },
      { index: "05", label: "Collectibles & Figurines" },
      { index: "06", label: "Hard Surface Models" },
      { index: "07", label: "Environments & Props" },
      { index: "08", label: "Custom 3D Sculptures" },
    ],
    note: "Have something else in mind? Let's talk about it.",
    workHref: "/work?category=sculpture3d",
    workLabel: "View 3D work",
    projectHref: "/#connect",
    projectLabel: "Commission a Sculpt",
    borderSrc: "/images/home/3DBorder|5784c0.png",
    borderVariant: "hud",
    accent: "#5784c0",
  },
];
