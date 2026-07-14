import type { PortableTextBlock } from "sanity";

import type { WorkThumbnailDisplay } from "@/lib/work-thumbnail-display";

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

export type SanityImageDimensions = {
  width: number;
  height: number;
  aspectRatio?: number;
};

export type SanityImage = {
  _type?: "image";
  asset?: SanityImageAsset;
  alt?: string;
  dimensions?: SanityImageDimensions | null;
};

export type SanityImageWithAsset = SanityImage & {
  asset: SanityImageAsset;
};

export function hasSanityImageAsset(
  image?: SanityImage | null,
): image is SanityImageWithAsset {
  return typeof image?.asset?._ref === "string" && image.asset._ref.length > 0;
}

export type WorkListItem = {
  _id: string;
  title: string;
  slug: string;
  category: WorkCategory;
  summary: string;
  coverImage?: SanityImage | null;
  thumbnailDisplay?: WorkThumbnailDisplay | null;
  featured: boolean;
  publishedAt: string;
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
