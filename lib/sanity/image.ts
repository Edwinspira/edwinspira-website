import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";

let builder: ReturnType<typeof imageUrlBuilder> | null = null;

type SanityImageAssetLike = {
  asset?: {
    _ref?: string | null;
  } | null;
};

function getBuilder() {
  if (!builder) {
    builder = imageUrlBuilder(getSanityClient());
  }
  return builder;
}

export function hasSanityImageAsset<T extends SanityImageAssetLike>(
  image: T | null | undefined,
): image is T & { asset: { _ref: string } } {
  return typeof image?.asset?._ref === "string" && image.asset._ref.length > 0;
}

export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source);
}
