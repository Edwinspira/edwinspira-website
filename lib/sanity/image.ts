import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";
import type { SanityImage, SanityImageAsset } from "@/lib/sanity/types";

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
): image is SanityImage & { asset: SanityImageAsset & { _ref: string } } {
  return Boolean(image?.asset?._ref?.trim());
}

export function sanityImageUrl(
  source: SanityImageSource,
  transform: (image: ReturnType<typeof urlFor>) => ReturnType<typeof urlFor>,
) {
  try {
    return transform(urlFor(source)).url();
  } catch {
    return null;
  }
}
