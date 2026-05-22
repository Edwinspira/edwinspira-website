export type HomeWhatIDoCard = {
  title: string;
  subtitle: string;
  description: string;
  borderSrc: string;
  iconSrc: string;
  accent: string;
};

export const HOME_WHAT_I_DO_CARDS: HomeWhatIDoCard[] = [
  {
    title: "ARTIST",
    subtitle: "アート",
    description:
      "Crafting visual stories and expressive artwork that connect emotion, design, and identity.",
    borderSrc: "/images/home/ArtBorder|cb3c37.png",
    iconSrc: "/images/home/DrawingIcon.png",
    accent: "#cb3c37",
  },
  {
    title: "SOFTWARE DEVELOPER",
    subtitle: "開発",
    description:
      "Building fast, responsive, and accessible websites with clean and efficient code.",
    borderSrc: "/images/home/SoftwareBorder|5ab160.png",
    iconSrc: "/images/home/SoftwareIcon.png",
    accent: "#5ab160",
  },
  {
    title: "VIDEO EDITOR",
    subtitle: "ビデオ",
    description:
      "Bringing ideas to life through smooth motion, transitions, and visual storytelling.",
    borderSrc: "/images/home/VideoBorder|a382b6.png",
    iconSrc: "/images/home/VideoIcon.png",
    accent: "#a382b6",
  },
  {
    title: "3D SCULPTOR",
    subtitle: "3D / ビジュアル",
    description:
      "Creating immersive 3D visuals and graphics that add depth and impact to every project.",
    borderSrc: "/images/home/3DBorder|5784c0.png",
    iconSrc: "/images/home/3DIcon.png",
    accent: "#5784c0",
  },
];
