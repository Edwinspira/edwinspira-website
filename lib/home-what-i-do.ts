export type HomeWhatIDoCard = {
  title: string;
  subtitle: string;
  description: string;
  borderSrc: string;
  /** When set, renders the SVG HUD frame instead of the border PNG. */
  borderVariant?: "hud";
  iconSrc: string;
  accent: string;
};

export const HOME_WHAT_I_DO_CARDS: HomeWhatIDoCard[] = [
  {
    title: "SOFTWARE ENGINEER",
    subtitle: "開発",
    description:
      "Building custom software and websites tailored to businesses and creators.",
    borderSrc: "/images/home/SoftwareBorder|5ab160.png",
    borderVariant: "hud",
    iconSrc: "/images/home/SoftwareIcon.png",
    accent: "#5ab160",
  },
  {
    title: "VISUAL ARTIST",
    subtitle: "アート",
    description:
      "Creating traditional, digital, and 3D artwork, logos, branding and visual identities.",
    borderSrc: "/images/home/ArtBorder|cb3c37.png",
    borderVariant: "hud",
    iconSrc: "/images/home/DrawingIcon.png",
    accent: "#cb3c37",
  },
  {
    title: "PHOTOGRAPHER",
    subtitle: "写真",
    description:
      "Capturing timeless imagery through thoughtful composition, natural light, and authentic storytelling.",
    borderSrc: "/images/home/ArtBorder|cb3c37.png",
    borderVariant: "hud",
    iconSrc: "/images/home/PhotographyIcon.png",
    accent: "#d4a828",
  },
  {
    title: "VIDEO EDITOR",
    subtitle: "ビデオ",
    description:
      "Producing polished videos that combine seamless editing, pacing, and compelling storytelling.",
    borderSrc: "/images/home/VideoBorder|a382b6.png",
    borderVariant: "hud",
    iconSrc: "/images/home/VideoIcon.png",
    accent: "#a382b6",
  },
  {
    title: "3D SCULPTOR",
    subtitle: "3D / ビジュアル",
    description:
      "Sculpting high quality 3D models for art, collectibles, games, and digital experiences.",
    borderSrc: "/images/home/3DBorder|5784c0.png",
    borderVariant: "hud",
    iconSrc: "/images/home/3DIcon.png",
    accent: "#5784c0",
  },
];
