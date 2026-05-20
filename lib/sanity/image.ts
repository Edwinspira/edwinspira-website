import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "@/lib/sanity/client";

const builder = imageUrlBuilder(getSanityClient());

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
