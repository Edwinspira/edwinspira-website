import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasSanityImageAsset } from "./sanity/image";

describe("hasSanityImageAsset", () => {
  it("rejects empty image objects that would crash the Sanity URL builder", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset({ _type: "image" }), false);
    assert.equal(hasSanityImageAsset({ _type: "image", asset: {} }), false);
    assert.equal(hasSanityImageAsset({ _type: "image", asset: { _ref: "" } }), false);
  });

  it("accepts image objects with an asset reference", () => {
    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: {
          _type: "reference",
          _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
        },
      }),
      true,
    );
  });
});
