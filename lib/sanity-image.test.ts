import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasSanityImageAsset } from "./sanity/image";

describe("hasSanityImageAsset", () => {
  it("accepts Sanity images with a concrete asset reference", () => {
    assert.equal(
      hasSanityImageAsset({
        asset: {
          _type: "reference",
          _ref: "image-abc123-1200x800-png",
        },
      }),
      true,
    );
  });

  it("rejects image objects whose asset reference is missing or blank", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset({}), false);
    assert.equal(hasSanityImageAsset({ asset: { _type: "reference", _ref: "" } }), false);
    assert.equal(
      hasSanityImageAsset({ asset: { _type: "reference", _ref: "   " } }),
      false,
    );
  });
});
