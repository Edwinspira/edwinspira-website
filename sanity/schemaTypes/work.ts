import { defineArrayMember, defineField, defineType } from "sanity";

const categories = [
  { title: "Software", value: "software" },
  { title: "Art", value: "art" },
  { title: "Video", value: "video" },
  { title: "3D Sculpture", value: "sculpture3d" },
] as const;

export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [...categories],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      description:
        "Used on the work detail page at full size. Grid thumbnail framing is controlled below.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (parent?.asset && !alt) {
                return "Alt text is required when an image is set";
              }
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "thumbnailDisplay",
      title: "Grid thumbnail display",
      type: "object",
      description:
        "Adjust how the cover image is cropped and zoomed in the work grid and featured projects section. Does not affect the detail page.",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "focusX",
          title: "Horizontal focus",
          type: "number",
          initialValue: 50,
          validation: (rule) => rule.min(0).max(100),
          description: "0 = left edge, 50 = center, 100 = right edge.",
        }),
        defineField({
          name: "focusY",
          title: "Vertical focus",
          type: "number",
          initialValue: 50,
          validation: (rule) => rule.min(0).max(100),
          description: "0 = top edge, 50 = center, 100 = bottom edge.",
        }),
        defineField({
          name: "zoom",
          title: "Zoom",
          type: "number",
          initialValue: 100,
          validation: (rule) => rule.min(100).max(200),
          description: "100 = default. Increase to zoom in on the focal point.",
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Embed source for video work (e.g. YouTube, Vimeo).",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Link to repo, ArtStation, Sketchfab, or other destination.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description:
        "When enabled, this project appears in the home page Featured Projects section (max 6).",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
  orderings: [
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
  ],
});
