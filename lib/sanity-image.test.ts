import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasSanityImageAsset } from "./sanity/image";

describe("hasSanityImageAsset", () => {
  it("accepts image values with a non-empty asset reference", () => {
    assert.equal(
      hasSanityImageAsset({ asset: { _ref: "image-abc-1200x800-png" } }),
      true,
    );
  });

  it("rejects missing, empty, or malformed asset references", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset({}), false);
    assert.equal(hasSanityImageAsset({ asset: {} }), false);
    assert.equal(hasSanityImageAsset({ asset: { _ref: "   " } }), false);
    assert.equal(hasSanityImageAsset({ asset: { _ref: 123 } }), false);
  });
});
