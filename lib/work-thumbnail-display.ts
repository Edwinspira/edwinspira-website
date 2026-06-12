import type { CSSProperties } from "react";

export type WorkThumbnailDisplay = {
  focusX?: number | null;
  focusY?: number | null;
  zoom?: number | null;
};

export const DEFAULT_WORK_THUMBNAIL_DISPLAY = {
  focusX: 50,
  focusY: 50,
  zoom: 100,
} as const;

export const WORK_THUMBNAIL_ZOOM_MIN = 100;
export const WORK_THUMBNAIL_ZOOM_MAX = 200;

/** Largest grid cell width (px) at xl: ~90rem container, 4 columns. */
export const WORK_THUMBNAIL_CELL_WIDTH = 480;
export const WORK_THUMBNAIL_MAX_WIDTH = 3840;
export const WORK_THUMBNAIL_RETINA_FACTOR = 2;
/** Studio preview width — keep in sync with WorkThumbnailDisplayInput. */
export const WORK_THUMBNAIL_PREVIEW_WIDTH = 800;

export function clampWorkThumbnailFocus(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function clampWorkThumbnailZoom(value: number) {
  return Math.min(
    WORK_THUMBNAIL_ZOOM_MAX,
    Math.max(WORK_THUMBNAIL_ZOOM_MIN, value),
  );
}

export function resolveWorkThumbnailDisplay(
  display?: WorkThumbnailDisplay | null,
) {
  return {
    focusX: display?.focusX ?? DEFAULT_WORK_THUMBNAIL_DISPLAY.focusX,
    focusY: display?.focusY ?? DEFAULT_WORK_THUMBNAIL_DISPLAY.focusY,
    zoom: display?.zoom ?? DEFAULT_WORK_THUMBNAIL_DISPLAY.zoom,
  };
}

/** Inline positioning for grid thumbnails (Studio + site). */
export function workThumbnailImageStyle(
  display?: WorkThumbnailDisplay | null,
): CSSProperties & Record<`--${string}`, string> {
  const { focusX, focusY, zoom } = resolveWorkThumbnailDisplay(display);

  return {
    "--work-thumb-zoom": String(zoom / 100),
    objectPosition: `${focusX}% ${focusY}%`,
    transformOrigin: `${focusX}% ${focusY}%`,
  };
}

/** CDN width for an uncropped source image; CSS handles 3:4 crop/zoom. */
export function workThumbnailSourceWidth(
  display?: WorkThumbnailDisplay | null,
): number {
  const { zoom } = resolveWorkThumbnailDisplay(display);
  const multiplier = (zoom / 100) * WORK_THUMBNAIL_RETINA_FACTOR;

  return Math.min(
    WORK_THUMBNAIL_MAX_WIDTH,
    Math.round(WORK_THUMBNAIL_CELL_WIDTH * multiplier),
  );
}
