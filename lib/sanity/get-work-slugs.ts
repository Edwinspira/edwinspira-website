import { fetchSanity } from "@/lib/sanity/fetch-sanity";
import { getSanityClient } from "@/lib/sanity/client";
import { workSlugsQuery } from "@/lib/sanity/queries";
import type { WorkSlug } from "@/lib/sanity/types";

export async function getWorkSlugs(): Promise<WorkSlug[]> {
  return fetchSanity(() => getSanityClient().fetch<WorkSlug[]>(workSlugsQuery), []);
}
