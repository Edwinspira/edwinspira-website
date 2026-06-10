import { defineField, defineType } from "sanity";

import { WorkThumbnailDisplayField } from "../components/WorkThumbnailDisplayField";
import { WorkThumbnailDisplayInput } from "../components/WorkThumbnailDisplayInput";

export const workThumbnailDisplay = defineType({
  name: "workThumbnailDisplay",
  title: "Grid thumbnail display",
  type: "object",
  description:
    "Drag to reposition and use the corner handle to resize the grid thumbnail. Does not affect the detail page.",
  components: {
    field: WorkThumbnailDisplayField,
    input: WorkThumbnailDisplayInput,
  },
  fields: [
    defineField({
      name: "focusX",
      title: "Horizontal focus",
      type: "number",
      initialValue: 50,
      hidden: true,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "focusY",
      title: "Vertical focus",
      type: "number",
      initialValue: 50,
      hidden: true,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "zoom",
      title: "Zoom (%)",
      type: "number",
      initialValue: 100,
      readOnly: true,
      validation: (rule) => rule.min(100).max(200),
      description:
        "Fallback readout. Use the preview above to adjust; publish to apply on the site.",
    }),
  ],
});
