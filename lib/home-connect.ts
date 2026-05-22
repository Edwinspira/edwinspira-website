export type HomeConnectPlatform = {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
};

export const CONNECT_ROTATE_MS = 10_000;
export const CONNECT_MANUAL_FREEZE_MS = 20_000;

export const HOME_CONNECT_PLATFORMS: HomeConnectPlatform[] = [
  {
    id: "mail",
    name: "EMAIL",
    description:
      "Reach out for inquiries, collaborations, and conversations about new projects.",
    iconSrc: "/images/social/MailIcon.png",
  },
  {
    id: "youtube",
    name: "YOUTUBE",
    description:
      "Watch video content, tutorials, process breakdowns, and creative showcases.",
    iconSrc: "/images/social/YouTubeIcon.png",
  },
  {
    id: "instagram",
    name: "INSTAGRAM",
    description:
      "Follow daily art, works in progress, reels, and visual snapshots from the studio.",
    iconSrc: "/images/social/InstagramIcon.png",
  },
  {
    id: "linkedin",
    name: "LINKEDIN",
    description:
      "Connect for professional updates, career milestones, and industry networking.",
    iconSrc: "/images/social/LinkedInIcon.png",
  },
  {
    id: "x",
    name: "X",
    description:
      "Catch quick updates, announcements, and thoughts on art, tech, and creative work.",
    iconSrc: "/images/social/XIcon.png",
  },
  {
    id: "deviantart",
    name: "DEVIANTART",
    description:
      "Explore illustrations, character art, fan pieces, and experimental visual work.",
    iconSrc: "/images/social/DeviantArtIcon.png",
  },
  {
    id: "behance",
    name: "BEHANCE",
    description:
      "Browse curated project case studies, process shots, and portfolio highlights.",
    iconSrc: "/images/social/BehanceIcon.png",
  },
  {
    id: "facebook",
    name: "FACEBOOK",
    description:
      "See community posts, event updates, and shared creative work in one place.",
    iconSrc: "/images/social/FacebookIcon.png",
  },
  {
    id: "github",
    name: "GITHUB",
    description:
      "Dig into open-source code, experiments, and repositories from development work.",
    iconSrc: "/images/social/GithubIcon.png",
  },
];
