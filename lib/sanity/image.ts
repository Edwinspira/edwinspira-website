import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";

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

type SanityImageWithAsset = SanityImageSource & { asset: { _ref: string } };

export function hasSanityImageAsset(
  source: (SanityImageSource & { asset?: { _ref?: unknown } | null }) | null | undefined,
): source is SanityImageWithAsset {
  return typeof source?.asset?._ref === "string" && source.asset._ref.trim().length > 0;
}
