import assert from "node:assert/strict";
import { describe, it } from "node:test";

import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { WorkCard } from "../components/work/WorkCard";
import { WorkDetailView } from "../components/work/WorkDetail";
import { hasSanityImageAsset } from "./sanity/image";
import type { SanityImage, WorkDetail, WorkListItem } from "./sanity/types";

const globalWithReact = globalThis as typeof globalThis & { React: typeof React };
globalWithReact.React = React;

const missingAssetImage: SanityImage = {
  _type: "image",
  alt: "Missing asset",
};

const emptyAssetImage: SanityImage = {
  _type: "image",
  asset: { _type: "reference", _ref: "   " },
  alt: "Empty asset",
};

const validAssetImage: SanityImage = {
  _type: "image",
  asset: { _type: "reference", _ref: "image-abc123-1200x800-jpg" },
  alt: "Valid asset",
};

const listWork: WorkListItem = {
  _id: "work-1",
  title: "Missing Asset Project",
  slug: "missing-asset-project",
  category: "software",
  summary: "A project whose image shell has no asset reference.",
  coverImage: missingAssetImage,
  thumbnailDisplay: null,
  featured: true,
  publishedAt: "2026-08-16T00:00:00.000Z",
};

const detailWork: WorkDetail = {
  ...listWork,
  body: null,
  gallery: [missingAssetImage, emptyAssetImage],
  videoUrl: null,
  externalUrl: null,
};

describe("Sanity image asset guards", () => {
  it("requires a non-empty asset reference before building image URLs", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset(missingAssetImage), false);
    assert.equal(hasSanityImageAsset(emptyAssetImage), false);
    assert.equal(hasSanityImageAsset(validAssetImage), true);
  });

  it("renders work cards when a cover image object has no asset reference", () => {
    const html = renderToStaticMarkup(createElement(WorkCard, { work: listWork }));

    assert.match(html, /Missing Asset Project/);
    assert.doesNotMatch(html, /<img\b/);
  });

  it("renders work details when cover and gallery image objects have no asset references", () => {
    const html = renderToStaticMarkup(createElement(WorkDetailView, { work: detailWork }));

    assert.match(html, /Missing Asset Project/);
    assert.doesNotMatch(html, /<img\b/);
  });
});
