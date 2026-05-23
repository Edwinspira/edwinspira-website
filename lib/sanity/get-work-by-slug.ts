import { fetchSanity } from "@/lib/sanity/fetch-sanity";
import { getSanityClient } from "@/lib/sanity/client";
import { workBySlugQuery } from "@/lib/sanity/queries";
import type { WorkDetail } from "@/lib/sanity/types";

export async function getWorkBySlug(slug: string): Promise<WorkDetail | null> {
  const normalized = slug.trim();
  if (!normalized) {
    return null;
  }

  return fetchSanity(
    () => getSanityClient().fetch<WorkDetail | null>(workBySlugQuery, { slug: normalized }),
    null,
  );
}
