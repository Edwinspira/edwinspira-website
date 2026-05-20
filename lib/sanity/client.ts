import { createClient, type SanityClient } from "next-sanity";

import { getSanityEnv } from "@/lib/sanity/env";

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!client) {
    const { projectId, dataset, apiVersion } = getSanityEnv();
    client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
      perspective: "published",
      stega: {
        enabled: false,
      },
    });
  }
  return client;
}

/** Server-only client with read token when draft/preview is needed later. */
export function getSanityClientWithToken(): SanityClient {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    return getSanityClient();
  }
  return getSanityClient().withConfig({ token });
}
