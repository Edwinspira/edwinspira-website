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

/** Base CDN width before zoom/retina multipliers (matches ~1x grid cell). */
export const WORK_THUMBNAIL_BASE_WIDTH = 960;
export const WORK_THUMBNAIL_MAX_WIDTH = 2400;
export const WORK_THUMBNAIL_RETINA_FACTOR = 2;

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

/** CSS variables consumed by `.work-card__image` in globals.css */
export function workThumbnailImageVars(
  display?: WorkThumbnailDisplay | null,
): Record<string, string> {
  const { focusX, focusY, zoom } = resolveWorkThumbnailDisplay(display);

  return {
    "--work-thumb-x": `${focusX}%`,
    "--work-thumb-y": `${focusY}%`,
    "--work-thumb-zoom": String(zoom / 100),
  };
}

/** CDN width scaled for zoom + retina so CSS scale() does not upscale a tiny bitmap. */
export function workThumbnailCoverWidth(
  display?: WorkThumbnailDisplay | null,
): number {
  const { zoom } = resolveWorkThumbnailDisplay(display);

  return Math.min(
    WORK_THUMBNAIL_MAX_WIDTH,
    Math.round(
      WORK_THUMBNAIL_BASE_WIDTH *
        (zoom / 100) *
        WORK_THUMBNAIL_RETINA_FACTOR,
    ),
  );
}
