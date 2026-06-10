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
export const WORK_THUMBNAIL_CELL_HEIGHT = Math.round(
  (WORK_THUMBNAIL_CELL_WIDTH * 4) / 3,
);
export const WORK_THUMBNAIL_MAX_WIDTH = 3840;
export const WORK_THUMBNAIL_MAX_HEIGHT = 5120;
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

/** CDN dimensions for a sharp uncropped source image; CSS handles 3:4 crop/zoom. */
export function workThumbnailCoverDimensions(
  display?: WorkThumbnailDisplay | null,
): { width: number; height: number } {
  const { zoom } = resolveWorkThumbnailDisplay(display);
  const multiplier = (zoom / 100) * WORK_THUMBNAIL_RETINA_FACTOR;

  return {
    width: Math.min(
      WORK_THUMBNAIL_MAX_WIDTH,
      Math.round(WORK_THUMBNAIL_CELL_WIDTH * multiplier),
    ),
    height: Math.min(
      WORK_THUMBNAIL_MAX_HEIGHT,
      Math.round(WORK_THUMBNAIL_CELL_HEIGHT * multiplier),
    ),
  };
}

/** Largest edge to request from the CDN without server-side cropping. */
export function workThumbnailSourceMaxSize(
  display?: WorkThumbnailDisplay | null,
): number {
  const { width, height } = workThumbnailCoverDimensions(display);
  return Math.max(width, height);
}
