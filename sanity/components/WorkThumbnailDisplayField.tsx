"use client";

import type { FieldProps } from "sanity";

export function WorkThumbnailDisplayField(props: FieldProps) {
  const title = props.title ?? "Grid thumbnail display";
  const description = props.description;

  return (
    <fieldset
      style={{
        border: "none",
        margin: "1.25rem 0 0",
        padding: 0,
        minWidth: 0,
      }}
    >
      <legend
        style={{
          display: "block",
          width: "100%",
          marginBottom: description ? "0.35rem" : "0.75rem",
          padding: 0,
          fontSize: "0.8125rem",
          fontWeight: 600,
          lineHeight: 1.4,
          color: "inherit",
        }}
      >
        {title}
      </legend>
      {description ? (
        <p
          style={{
            margin: "0 0 0.75rem",
            color: "rgb(161 161 170)",
            fontSize: "0.8125rem",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      ) : null}
      {props.children}
    </fieldset>
  );
}
