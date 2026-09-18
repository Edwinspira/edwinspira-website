import assert from "node:assert/strict";
import { describe, it } from "node:test";

import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { WorkCard } from "@/components/work/WorkCard";
import { WorkDetailView } from "@/components/work/WorkDetail";
import { hasSanityImageAsset } from "@/lib/sanity/image";
import type { SanityImage, WorkDetail } from "@/lib/sanity/types";

(globalThis as unknown as { React: typeof React }).React = React;

const missingAssetImage = {
  _type: "image",
  alt: "Draft image without an asset",
} satisfies SanityImage;

const baseWork: WorkDetail = {
  _id: "work-1",
  title: "Draft Work",
  slug: "draft-work",
  category: "art",
  summary: "A draft work entry with incomplete image data.",
  coverImage: missingAssetImage,
  thumbnailDisplay: null,
  featured: true,
  publishedAt: "2026-09-18",
  body: null,
  gallery: [missingAssetImage],
  videoUrl: null,
  externalUrl: null,
};

describe("Sanity image asset guards", () => {
  it("detects image values that cannot be used to build Sanity CDN URLs", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset(missingAssetImage), false);
    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: { _type: "reference", _ref: "image-abc-1200x800-png" },
      }),
      true,
    );
  });

  it("renders work surfaces when Sanity returns image objects without assets", () => {
    assert.doesNotThrow(() =>
      renderToStaticMarkup(React.createElement(WorkCard, { work: baseWork })),
    );
    assert.doesNotThrow(() =>
      renderToStaticMarkup(React.createElement(WorkDetailView, { work: baseWork })),
    );
  });
});
