import { getSanityClient } from "@/lib/sanity/client";
import { featuredWorksQuery } from "@/lib/sanity/queries";
import type { WorkListItem } from "@/lib/sanity/types";

export async function getFeaturedWorks(): Promise<WorkListItem[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()) {
    return [];
  }

  try {
    return await getSanityClient().fetch<WorkListItem[]>(featuredWorksQuery);
  } catch {
    return [];
  }
}
