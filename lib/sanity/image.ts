import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";
import type { SanityImage, SanityImageAsset } from "@/lib/sanity/types";

let builder: ReturnType<typeof createImageUrlBuilder> | null = null;

type SanityImageWithAsset = SanityImage & {
  asset: SanityImageAsset & { _ref: string };
};

const SANITY_IMAGE_ASSET_REF_PATTERN = /^image-[A-Za-z0-9]+-\d+x\d+-[a-z0-9]+$/;

function getBuilder() {
  if (!builder) {
    builder = createImageUrlBuilder(getSanityClient());
  }
  return builder;
}

export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source);
}

export function hasSanityImageAsset(
  image: SanityImage | null | undefined,
): image is SanityImageWithAsset {
  const ref = image?.asset?._ref;
  return typeof ref === "string" && SANITY_IMAGE_ASSET_REF_PATTERN.test(ref);
}
