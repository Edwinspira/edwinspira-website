type SiteNavIconProps = {
  className?: string;
};

const svgProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
} as const;

/** Shared HUD brackets so the three marks read as one logo set. */
function NavIconFrame() {
  return (
    <g
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M6 3.6 H11" />
      <path d="M21 3.6 H26" />
      <path d="M6 28.4 H11" />
      <path d="M21 28.4 H26" />
      <path d="M3.6 6 V11" />
      <path d="M3.6 21 V26" />
      <path d="M28.4 6 V11" />
      <path d="M28.4 21 V26" />
    </g>
  );
}

/** Beacon homestead — blade roof over the nav diamond. */
export function SiteNavHomeIcon({ className = "" }: SiteNavIconProps) {
  return (
    <svg {...svgProps} className={className}>
      <NavIconFrame />
      <path
        d="M7.4 15.4 L16 6.6 L24.6 15.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M10.2 14.6 V23.6 H21.8 V14.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M16 16.2 L18.15 18.35 L16 20.5 L13.85 18.35 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Construct mark — isometric craft block with a diamond core. */
export function SiteNavWorkIcon({ className = "" }: SiteNavIconProps) {
  return (
    <svg {...svgProps} className={className}>
      <NavIconFrame />
      <path
        d="M16 7.2 L24.4 11.95 L16 16.7 L7.6 11.95 Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
      />
      <path
        d="M7.6 11.95 V19.4 L16 24.2 V16.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
      />
      <path
        d="M24.4 11.95 V19.4 L16 24.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
      />
      <path d="M16 10.85 L17.4 12.25 L16 13.65 L14.6 12.25 Z" fill="currentColor" />
    </svg>
  );
}

/** Uplink mark — brand diamond broadcasting a two-way signal. */
export function SiteNavContactIcon({ className = "" }: SiteNavIconProps) {
  return (
    <svg {...svgProps} className={className}>
      <NavIconFrame />
      <path d="M16 12 L18.45 16 L16 20 L13.55 16 Z" fill="currentColor" />
      <path
        d="M10.55 12.35 L7.85 16 L10.55 19.65"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M21.45 12.35 L24.15 16 L21.45 19.65"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M8.2 9.85 L4.7 16 L8.2 22.15"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M23.8 9.85 L27.3 16 L23.8 22.15"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}
