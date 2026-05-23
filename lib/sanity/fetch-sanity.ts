import { isSanityConfigured } from "@/lib/sanity/is-configured";

export async function fetchSanity<T>(
  fetcher: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isSanityConfigured()) {
    return fallback;
  }

  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}
