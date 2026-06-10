import { defineQuery } from "next-sanity";

const workListFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  category,
  summary,
  coverImage,
  thumbnailDisplay,
  featured,
  publishedAt,
  sortOrder
`;

export const worksQuery = defineQuery(`
  *[_type == "work" && defined(slug.current)]
  | order(sortOrder asc, publishedAt desc) {
    ${workListFields}
  }
`);

export const featuredWorksQuery = defineQuery(`
  *[_type == "work" && featured == true && defined(slug.current)]
  | order(sortOrder asc, publishedAt desc) [0...6] {
    ${workListFields}
  }
`);

export const workBySlugQuery = defineQuery(`
  *[_type == "work" && slug.current == $slug][0] {
    ${workListFields},
    body,
    gallery,
    videoUrl,
    externalUrl
  }
`);

export const workSlugsQuery = defineQuery(`
  *[_type == "work" && defined(slug.current)]{
    "slug": slug.current
  }
`);
