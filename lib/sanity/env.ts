const DEFAULT_API_VERSION = "2025-05-20";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? DEFAULT_API_VERSION;

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(
      `Missing environment variable ${name}. See docs/setup.md for Sanity configuration.`,
    );
  }
  return value;
}

export function getSanityEnv() {
  return {
    projectId: required(
      "NEXT_PUBLIC_SANITY_PROJECT_ID",
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    ),
    dataset: required(
      "NEXT_PUBLIC_SANITY_DATASET",
      process.env.NEXT_PUBLIC_SANITY_DATASET,
    ),
    apiVersion,
  };
}

/** Used by Studio config at build time; does not throw. */
export function getSanityStudioEnv() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion,
  };
}
