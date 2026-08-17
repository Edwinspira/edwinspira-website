import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as React from "react";

import { hasSanityImageAsset } from "./sanity/image";
import type { SanityImage, WorkDetail, WorkListItem } from "./sanity/types";

const missingAssetImage: SanityImage = {
  _type: "image",
  alt: "Image without an asset reference",
};

const emptyAssetImage: SanityImage = {
  _type: "image",
  asset: { _type: "reference", _ref: "" },
};

const validAssetImage: SanityImage = {
  _type: "image",
  asset: { _type: "reference", _ref: "image-abc-1200x800-png" },
};

const workListItem: WorkListItem = {
  _id: "work-1",
  title: "Missing Asset Work",
  slug: "missing-asset-work",
  category: "art",
  summary: "A work item whose CMS image object has no asset reference.",
  coverImage: missingAssetImage,
  thumbnailDisplay: null,
  featured: true,
  publishedAt: "2026-08-17T00:00:00.000Z",
};

const workDetail: WorkDetail = {
  ...workListItem,
  body: null,
  gallery: [missingAssetImage],
  videoUrl: null,
  externalUrl: null,
};

describe("Sanity image asset guards", () => {
  it("recognizes only images with usable asset references", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset(missingAssetImage), false);
    assert.equal(hasSanityImageAsset(emptyAssetImage), false);
    assert.equal(hasSanityImageAsset(validAssetImage), true);
  });

  it("does not build WorkCard or WorkDetail URLs when asset references are missing", async () => {
    (globalThis as typeof globalThis & { React: typeof React }).React = React;
    const [{ WorkCard }, { WorkDetailView }] = await Promise.all([
      import("../components/work/WorkCard"),
      import("../components/work/WorkDetail"),
    ]);

    assert.doesNotThrow(() => WorkCard({ work: workListItem }));
    assert.doesNotThrow(() => WorkDetailView({ work: workDetail }));
  });
});
