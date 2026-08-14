import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasSanityImageAsset, urlFor } from "./sanity/image";
import type { SanityImage } from "./sanity/types";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc123";
process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

describe("Sanity image asset guards", () => {
  it("reproduces the image URL builder crash for missing assets", () => {
    const missingAsset = { _type: "image" } as Parameters<typeof urlFor>[0];

    assert.throws(
      () => urlFor(missingAsset).width(400).url(),
      /Unable to resolve image URL from source/,
    );
  });

  it("only accepts image objects with a non-empty asset reference", () => {
    const invalidImages: Array<SanityImage | null | undefined> = [
      null,
      undefined,
      {},
      { _type: "image", asset: null },
      { _type: "image", asset: {} },
      { _type: "image", asset: { _ref: "" } },
      { _type: "image", asset: { _ref: "   " } },
    ];

    for (const image of invalidImages) {
      assert.equal(hasSanityImageAsset(image), false);
    }

    assert.equal(
      hasSanityImageAsset({
        _type: "image",
        asset: {
          _type: "reference",
          _ref: "image-abc123-1200x800-png",
        },
      }),
      true,
    );
  });
});
