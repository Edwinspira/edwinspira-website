import assert from "node:assert/strict";
import { describe, it } from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { WorkCard } from "@/components/work/WorkCard";
import { WorkDetailView } from "@/components/work/WorkDetail";
import { hasSanityImageAsset } from "@/lib/sanity/image";
import type { SanityImage, WorkDetail, WorkListItem } from "@/lib/sanity/types";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const malformedImage: SanityImage = {
  _type: "image",
  asset: null,
  alt: "Broken CMS image",
};

const baseWork: WorkListItem = {
  _id: "work-1",
  title: "Broken Cover",
  slug: "broken-cover",
  category: "art",
  summary: "A work item with a malformed Sanity image object.",
  coverImage: malformedImage,
  thumbnailDisplay: null,
  featured: true,
  publishedAt: "2026-08-13T00:00:00.000Z",
};

describe("Sanity image asset guards", () => {
  it("rejects image objects without a non-empty asset ref", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset({ _type: "image" }), false);
    assert.equal(hasSanityImageAsset({ _type: "image", asset: null }), false);
    assert.equal(
      hasSanityImageAsset({ _type: "image", asset: { _ref: "   " } }),
      false,
    );
  });

  it("accepts image objects with an asset ref", () => {
    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: {
          _type: "reference",
          _ref: "image-abc123-1200x900-png",
        },
      }),
      true,
    );
  });

  it("renders work cards without building URLs for malformed cover images", () => {
    const html = renderToStaticMarkup(WorkCard({ work: baseWork }));

    assert.match(html, /work-card__media/);
    assert.doesNotMatch(html, /Broken CMS image/);
  });

  it("renders work details while skipping malformed cover and gallery images", () => {
    const work: WorkDetail = {
      ...baseWork,
      gallery: [null, malformedImage, { _type: "image", asset: { _ref: "" } }],
      body: [],
      videoUrl: null,
      externalUrl: null,
    };

    const html = renderToStaticMarkup(WorkDetailView({ work }));

    assert.match(html, /Broken Cover/);
    assert.doesNotMatch(html, /Broken CMS image/);
  });
});
