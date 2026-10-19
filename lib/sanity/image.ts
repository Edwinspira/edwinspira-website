import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";

let builder: ReturnType<typeof imageUrlBuilder> | null = null;

type SanityImageMaybeAsset = {
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

export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source);
}

export function hasSanityImageAsset<T extends SanityImageMaybeAsset>(
  source: T | null | undefined,
): source is T & { asset: { _ref: string } } {
  return Boolean(source?.asset?._ref?.trim());
}
