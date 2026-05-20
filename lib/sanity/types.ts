import type { PortableTextBlock } from "sanity";

export const WORK_CATEGORIES = [
  "software",
  "art",
  "video",
  "sculpture3d",
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type SanityImageAsset = {
  _ref: string;
  _type: "reference";
};

export type SanityImage = {
  _type?: "image";
  asset?: SanityImageAsset;
  alt?: string;
};

export type WorkListItem = {
  _id: string;
  title: string;
  slug: string;
  category: WorkCategory;
  summary: string;
  coverImage?: SanityImage | null;
  featured: boolean;
  publishedAt: string;
  sortOrder: number;
};

export type WorkDetail = WorkListItem & {
  body?: PortableTextBlock[] | null;
  gallery?: SanityImage[] | null;
  videoUrl?: string | null;
  externalUrl?: string | null;
};

export type WorkSlug = {
  slug: string;
};
