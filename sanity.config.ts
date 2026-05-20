import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { getSanityStudioEnv } from "@/lib/sanity/env";

import { schemaTypes } from "./sanity/schemaTypes";

const { projectId, dataset } = getSanityStudioEnv();

export default defineConfig({
  name: "edwinspira",
  title: "Edwinspira",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
