import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasSanityImageAsset } from "./sanity/image";

describe("hasSanityImageAsset", () => {
  it("accepts only Sanity images with a usable asset reference", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset({}), false);
    assert.equal(hasSanityImageAsset({ asset: undefined }), false);
    assert.equal(
      hasSanityImageAsset({
        asset: { _ref: "", _type: "reference" },
      }),
      false,
    );
    assert.equal(
      hasSanityImageAsset({
        asset: { _ref: "   ", _type: "reference" },
      }),
      false,
    );
    assert.equal(
      hasSanityImageAsset({
        asset: { _ref: "image-abc123-1200x800-jpg", _type: "reference" },
      }),
      true,
    );
  });
});
