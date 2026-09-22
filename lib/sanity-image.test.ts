import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createImageUrlBuilder } from "@sanity/image-url";

import { hasSanityImageAsset } from "./sanity/image";

const builder = createImageUrlBuilder({
  projectId: "abc123",
  dataset: "production",
});

describe("Sanity image asset guards", () => {
  it("rejects image objects that would crash the Sanity image URL builder", () => {
    const missingAsset = { _type: "image" } as const;

    assert.throws(
      () => builder.image(missingAsset).width(1200).url(),
      /Unable to resolve image URL from source/,
    );
    assert.equal(hasSanityImageAsset(missingAsset), false);
    assert.equal(hasSanityImageAsset({ _type: "image", asset: null }), false);
    assert.equal(
      hasSanityImageAsset({ _type: "image", asset: { _type: "reference", _ref: "not-an-image-ref" } }),
      false,
    );
  });

  it("accepts valid Sanity image asset references", () => {
    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: {
          _type: "reference",
          _ref: "image-Tb9Ew8CXIwaY6R41Wy2OZDRA-2000x3000-jpg",
        },
      }),
      true,
    );
  });
});
