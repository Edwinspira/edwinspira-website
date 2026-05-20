import { defineCliConfig } from "sanity/cli";

import { getSanityStudioEnv } from "@/lib/sanity/env";

const { projectId, dataset } = getSanityStudioEnv();

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
