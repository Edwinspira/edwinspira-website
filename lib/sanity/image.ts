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

export function hasSanityImageAsset(
  source: unknown,
): source is SanityImageSource & { asset: { _ref: string } } {
  if (!source || typeof source !== "object") {
    return false;
  }

  const asset = (source as { asset?: unknown }).asset;
  if (!asset || typeof asset !== "object") {
    return false;
  }

  const ref = (asset as { _ref?: unknown })._ref;
  return typeof ref === "string" && ref.trim().length > 0;
}
