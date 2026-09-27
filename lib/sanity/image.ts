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
): image is SanityImage & { asset: { _ref: string } } {
  const ref = image?.asset?._ref;
  return typeof ref === "string" && ref.trim().length > 0;
}
