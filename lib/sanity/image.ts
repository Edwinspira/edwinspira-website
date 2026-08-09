import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";

let builder: ReturnType<typeof imageUrlBuilder> | null = null;

type SanityImageWithOptionalAsset = {
  asset?: {
    _ref?: unknown;
  } | null;
} | null | undefined;

function getBuilder() {
  if (!builder) {
    builder = imageUrlBuilder(getSanityClient());
  }
  return builder;
}

export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source);
}

export function hasSanityImageAsset<T extends SanityImageWithOptionalAsset>(
  source: T,
): source is T & { asset: { _ref: string } } {
  return (
    typeof source?.asset?._ref === "string" && source.asset._ref.length > 0
  );
}
