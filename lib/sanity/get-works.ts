import { fetchSanity } from "@/lib/sanity/fetch-sanity";
import { getSanityClient } from "@/lib/sanity/client";
import { worksQuery } from "@/lib/sanity/queries";
import type { WorkListItem } from "@/lib/sanity/types";

export async function getWorks(): Promise<WorkListItem[]> {
  return fetchSanity(
    () => getSanityClient().fetch<WorkListItem[]>(worksQuery),
    [],
  );
}
