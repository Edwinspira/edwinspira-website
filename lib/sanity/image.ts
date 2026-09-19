import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";
import type { SanityImage } from "@/lib/sanity/types";

let builder: ReturnType<typeof imageUrlBuilder> | null = null;

function getBuilder() {
  if (!builder) {
    builder = imageUrlBuilder(getSanityClient());
  }
  return builder;
}

export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source);
}

export function hasSanityImageAsset(
  image?: SanityImage | null,
): image is SanityImage & { asset: NonNullable<SanityImage["asset"]> } {
  return typeof image?.asset?._ref === "string" && image.asset._ref.trim().length > 0;
}
