"use client";

import imageUrlBuilder from "@sanity/image-url";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  set,
  useClient,
  useFormValue,
  type ObjectInputProps,
  type Path,
} from "sanity";

import {
  clampWorkThumbnailFocus,
  clampWorkThumbnailZoom,
  DEFAULT_WORK_THUMBNAIL_DISPLAY,
  resolveWorkThumbnailDisplay,
  type WorkThumbnailDisplay,
} from "@/lib/work-thumbnail-display";
import { apiVersion } from "@/lib/sanity/env";

type CoverImageValue = {
  asset?: { _ref?: string };
} | null;

type DragMode = "pan" | "zoom";

type DragState = {
  mode: DragMode;
  startX: number;
  startY: number;
  startFocusX: number;
  startFocusY: number;
  startZoom: number;
};

const PREVIEW_ASPECT = 3 / 4;
const ZOOM_DRAG_SENSITIVITY = 0.35;

export function WorkThumbnailDisplayInput(props: ObjectInputProps) {
  const client = useClient({ apiVersion });
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const coverImagePath = useMemo(
    () => [...props.path.slice(0, -1), "coverImage"] as Path,
    [props.path],
  );
  const coverImage = useFormValue(coverImagePath) as CoverImageValue;

  const display = resolveWorkThumbnailDisplay(
    (props.value as WorkThumbnailDisplay | undefined) ?? null,
  );

  const coverUrl = useMemo(() => {
    if (!coverImage?.asset?._ref) {
      return null;
    }

    return imageUrlBuilder(client)
      .image(coverImage)
      .width(800)
      .fit("max")
      .url();
  }, [client, coverImage]);

  const commitDisplay = useCallback(
    (next: WorkThumbnailDisplay) => {
      props.onChange(set(next));
    },
    [props],
  );

  const resetDisplay = useCallback(() => {
    commitDisplay({ ...DEFAULT_WORK_THUMBNAIL_DISPLAY });
  }, [commitDisplay]);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      const frame = previewRef.current;

      if (!drag || !frame) {
        return;
      }

      const frameWidth = frame.clientWidth;
      const frameHeight = frame.clientHeight;

      if (drag.mode === "pan") {
        const deltaX = event.clientX - drag.startX;
        const deltaY = event.clientY - drag.startY;

        commitDisplay({
          focusX: clampWorkThumbnailFocus(
            drag.startFocusX - (deltaX / frameWidth) * 100,
          ),
          focusY: clampWorkThumbnailFocus(
            drag.startFocusY - (deltaY / frameHeight) * 100,
          ),
          zoom: drag.startZoom,
        });
        return;
      }

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      const diagonal = (deltaX + deltaY) / 2;

      commitDisplay({
        focusX: drag.startFocusX,
        focusY: drag.startFocusY,
        zoom: clampWorkThumbnailZoom(
          drag.startZoom + diagonal * ZOOM_DRAG_SENSITIVITY,
        ),
      });
    },
    [commitDisplay],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  const startDrag = useCallback(
    (mode: DragMode, event: React.PointerEvent) => {
      if (!coverUrl) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setIsDragging(true);
      dragRef.current = {
        mode,
        startX: event.clientX,
        startY: event.clientY,
        startFocusX: display.focusX,
        startFocusY: display.focusY,
        startZoom: display.zoom,
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [
      coverUrl,
      display.focusX,
      display.focusY,
      display.zoom,
      onPointerMove,
      onPointerUp,
    ],
  );

  if (!coverUrl) {
    return (
      <div
        style={{
          padding: "1rem",
          border: "1px solid rgb(255 255 255 / 0.12)",
          borderRadius: "4px",
          color: "rgb(161 161 170)",
          fontSize: "0.8125rem",
          lineHeight: 1.5,
        }}
      >
        Add a cover image above to drag and resize the grid thumbnail preview.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <p
        style={{
          margin: 0,
          color: "rgb(161 161 170)",
          fontSize: "0.8125rem",
          lineHeight: 1.5,
        }}
      >
        Drag the image to reposition. Drag the corner handle to zoom in or out.
      </p>

      <div
        ref={previewRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "20rem",
          aspectRatio: `${PREVIEW_ASPECT}`,
          overflow: "hidden",
          border: "1px solid rgb(255 31 31 / 0.55)",
          background: "rgb(0 0 0 / 0.85)",
          boxShadow: "inset 0 0 20px rgb(255 31 31 / 0.06)",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt="Grid thumbnail preview"
          draggable={false}
          onPointerDown={(event) => startDrag("pan", event)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${display.focusX}% ${display.focusY}%`,
            transform: `scale(${display.zoom / 100})`,
            transformOrigin: `${display.focusX}% ${display.focusY}%`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        />

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            border: "1px solid rgb(255 31 31 / 0.35)",
            boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.04)",
          }}
        />

        <button
          type="button"
          aria-label="Resize thumbnail zoom"
          onPointerDown={(event) => startDrag("zoom", event)}
          style={{
            position: "absolute",
            right: "0.35rem",
            bottom: "0.35rem",
            width: "1.1rem",
            height: "1.1rem",
            padding: 0,
            border: "1px solid rgb(255 31 31 / 0.85)",
            background: "rgb(0 0 0 / 0.75)",
            cursor: "nwse-resize",
            touchAction: "none",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, transparent 42%, rgb(255 31 31) 42%, rgb(255 31 31) 58%, transparent 58%)",
            }}
          />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "rgb(161 161 170)",
            fontSize: "0.8125rem",
          }}
        >
          Focus {Math.round(display.focusX)}% / {Math.round(display.focusY)}% · Zoom{" "}
          {Math.round(display.zoom)}%
        </p>
        <button
          type="button"
          onClick={resetDisplay}
          style={{
            margin: 0,
            padding: "0.35rem 0.65rem",
            border: "1px solid rgb(255 255 255 / 0.12)",
            borderRadius: "4px",
            background: "transparent",
            color: "inherit",
            fontSize: "0.8125rem",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <details style={{ fontSize: "0.8125rem", color: "rgb(161 161 170)" }}>
        <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
          Manual values (fallback)
        </summary>
        {props.renderDefault(props)}
      </details>
    </div>
  );
}
