import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasSanityImageAsset } from "@/lib/sanity/image";

const partialImage = {
  _type: "image" as const,
  alt: "Draft image without an asset",
};

describe("Sanity image guards", () => {
  it("requires an asset reference before building image URLs", () => {
    assert.equal(hasSanityImageAsset(null), false);
    assert.equal(hasSanityImageAsset(partialImage), false);
    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: { _type: "reference", _ref: "image-abc-1200x800-png" },
      }),
      true,
    );
  });

  it("filters partial CMS image objects before URL generation", () => {
    const gallery = [
      partialImage,
      {
        _type: "image" as const,
        asset: { _type: "reference" as const, _ref: "image-abc-1200x800-png" },
      },
    ];

    assert.deepEqual(gallery.filter(hasSanityImageAsset), [gallery[1]]);
  });
});
