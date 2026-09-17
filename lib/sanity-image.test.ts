import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { WorkCard } from "@/components/work/WorkCard";
import { WorkDetailView } from "@/components/work/WorkDetail";
import { hasSanityImageAsset } from "@/lib/sanity/image";
import type { WorkDetail, WorkListItem } from "@/lib/sanity/types";

const partialImage = {
  _type: "image" as const,
  alt: "Draft image without an asset",
};

const workListItem: WorkListItem = {
  _id: "work-1",
  title: "Draft Project",
  slug: "draft-project",
  category: "software",
  summary: "A draft project with an incomplete cover image.",
  coverImage: partialImage,
  thumbnailDisplay: null,
  featured: false,
  publishedAt: "2026-01-01",
};

const workDetail: WorkDetail = {
  ...workListItem,
  body: null,
  gallery: [partialImage],
  videoUrl: null,
  externalUrl: null,
};

describe("Sanity image guards", () => {
  it("requires an asset reference before building image URLs", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset(partialImage), false);
    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: { _type: "reference", _ref: "image-abc-1200x800-png" },
      }),
      true,
    );
  });

  it("renders work surfaces when CMS image objects are missing assets", () => {
    assert.doesNotThrow(() =>
      renderToStaticMarkup(createElement(WorkCard, { work: workListItem })),
    );
    assert.doesNotThrow(() =>
      renderToStaticMarkup(createElement(WorkDetailView, { work: workDetail })),
    );
  });
});
