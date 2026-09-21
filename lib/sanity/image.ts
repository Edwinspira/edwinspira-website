import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";
import type { SanityImage, SanityImageAsset } from "@/lib/sanity/types";

type SanityImageWithAsset = SanityImage & { asset: SanityImageAsset };

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
  image: SanityImage | null | undefined,
): image is SanityImageWithAsset {
  return typeof image?.asset?._ref === "string" && image.asset._ref.length > 0;
}
