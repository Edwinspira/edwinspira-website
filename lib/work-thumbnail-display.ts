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
