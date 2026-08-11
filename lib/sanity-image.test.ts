import assert from "node:assert/strict";
import { describe, it } from "node:test";

import imageUrlBuilder from "@sanity/image-url";

import { hasSanityImageAsset } from "./sanity/image";

const builder = imageUrlBuilder({
  projectId: "abc123",
  dataset: "production",
});

describe("Sanity image asset guards", () => {
  it("rejects image objects without asset refs before URL generation", () => {
    const missingAssetImage = { _type: "image" as const, alt: "Draft cover" };

    assert.equal(hasSanityImageAsset(missingAssetImage), false);
    assert.throws(
      () => builder.image(missingAssetImage).url(),
      /Unable to resolve image URL/,
    );
  });

  it("accepts image objects with asset refs", () => {
    const image = {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: "image-abc123def456-1200x900-png",
      },
    };

    assert.equal(hasSanityImageAsset(image), true);
    assert.match(
      builder.image(image).width(100).url(),
      /cdn\.sanity\.io\/images\/abc123\/production\/abc123def456-1200x900\.png/,
    );
  });
});
