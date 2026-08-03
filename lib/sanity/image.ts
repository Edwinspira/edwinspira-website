import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";
import type { SanityImage, SanityImageAsset } from "@/lib/sanity/types";

const SANITY_IMAGE_ASSET_REF_PATTERN = /^image-[A-Za-z0-9]+-\d+x\d+-[A-Za-z0-9]+$/;

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
): image is SanityImage & { asset: SanityImageAsset } {
  return (
    typeof image?.asset?._ref === "string" &&
    SANITY_IMAGE_ASSET_REF_PATTERN.test(image.asset._ref)
  );
}
