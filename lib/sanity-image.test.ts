import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { WorkCard } from "../components/work/WorkCard";
import { WorkDetailView } from "../components/work/WorkDetail";
import { hasSanityImageAsset } from "./sanity/image";
import type { SanityImage, WorkDetail, WorkListItem } from "./sanity/types";

const missingAssetImage: SanityImage = {
  _type: "image",
  alt: "Image without an asset reference",
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
    assert.equal(hasSanityImageAsset({ _type: "image" }), false);
    assert.equal(hasSanityImageAsset({ _type: "image", asset: { _ref: "" } }), false);
    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: { _type: "reference", _ref: "image-abc-1200x800-png" },
      }),
      true,
    );
  });

  it("does not build WorkCard or WorkDetail URLs when asset references are missing", () => {
    assert.doesNotThrow(() => WorkCard({ work: workListItem }));
    assert.doesNotThrow(() => WorkDetailView({ work: workDetail }));
  });
});
