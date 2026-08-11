import { useId } from "react";

import type { HomeWhatIDoCard } from "@/lib/home-what-i-do";

type SkillIconId = HomeWhatIDoCard["id"];

type HomeWhatIDoSkillIconProps = {
  id: SkillIconId;
  className?: string;
};

const CX = 115.5;
const CY = 115;
const VIEW_W = 232;
const VIEW_H = 231;
const INNER_R = 71;
const RING_R = 74.5;
const RING_SW = 7;

const FRAME: Record<
  SkillIconId,
  {
    ring: string;
    glow: string;
    discEdge: string;
    discMid: string;
  }
> = {
  "software-engineer": {
    ring: "#4faf58",
    glow: "#88ad4c",
    discMid: "#2f4f2a",
    discEdge: "#1f4021",
  },
  "visual-artist": {
    ring: "#c43531",
    glow: "#c16a60",
    discMid: "#7a221c",
    discEdge: "#681a16",
  },
  photographer: {
    ring: "#e3b709",
    glow: "#f0cc5a",
    discMid: "#d08900",
    discEdge: "#c56c00",
  },
  "video-editor": {
    ring: "#9977b0",
    glow: "#8e5d87",
    discMid: "#3d1547",
    discEdge: "#300c3d",
  },
  "3d-sculptor": {
    ring: "#4d79b9",
    glow: "#5d98bb",
    discMid: "#243c68",
    discEdge: "#1b2b52",
  },
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function CompassFrame({
  colors,
  glowId,
  discId,
  bloom = true,
}: {
  colors: (typeof FRAME)[SkillIconId];
  glowId: string;
  discId: string;
  bloom?: boolean;
}) {
  const tip = 2.5;
  // Overlap the ring stroke so antialiasing doesn't leave a hairline gap.
  const outer = RING_R + RING_SW / 2 - 2.25;
  const baseN = CY - outer;
  const baseS = CY + outer;
  const baseW = CX - outer;
  const baseE = CX + outer;
  const half = 4.6;

  return (
    <>
      <defs>
        <radialGradient
          id={discId}
          cx="36%"
          cy="32%"
          r="72%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={colors.glow} />
          <stop offset="42%" stopColor={colors.discMid} />
          <stop offset="100%" stopColor={colors.discEdge} />
        </radialGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" result="blur" />
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r={INNER_R} fill={`url(#${discId})`} />
      {bloom ? (
        <circle
          cx={CX - 18}
          cy={CY - 20}
          r={22}
          fill={colors.glow}
          opacity="0.45"
          filter={`url(#${glowId})`}
        />
      ) : null}

      <g fill={colors.ring}>
        <polygon
          points={`${CX},${tip} ${CX - half},${baseN} ${CX + half},${baseN}`}
        />
        <polygon
          points={`${VIEW_W - tip},${CY} ${baseE},${CY - half} ${baseE},${CY + half}`}
        />
        <polygon
          points={`${CX},${VIEW_H - tip} ${CX - half},${baseS} ${CX + half},${baseS}`}
        />
        <polygon
          points={`${tip},${CY} ${baseW},${CY - half} ${baseW},${CY + half}`}
        />
      </g>
      <circle
        cx={CX}
        cy={CY}
        r={RING_R}
        fill="none"
        stroke={colors.ring}
        strokeWidth={RING_SW}
      />
    </>
  );
}

function SoftwareGlyph() {
  return (
    <g fill="#fff">
      <rect x="77" y="76" width="81" height="6" />
      <rect x="77" y="82" width="7" height="48" />
      <rect x="151" y="82" width="7" height="22" />
      <rect x="93" y="97" width="49" height="7" />
      <rect x="93" y="104" width="7" height="7" />
      <rect x="93" y="111" width="49" height="7" />
      <rect x="77" y="130" width="45" height="7" />
      <rect x="115" y="137" width="7" height="13" />
      <rect x="79" y="150" width="43" height="7" />
    </g>
  );
}

function ArtistGlyph() {
  // Traced from DrawingIcon.png: arc runs from just left of 6 o'clock
  // clockwise to ~1:30, with square (radial) ends and a wide right-side gap.
  const r = 63.5;
  const start = polar(CX, CY, r, 93.2);
  const end = polar(CX, CY, r, -43.4);
  return (
    <g>
      <path
        d={`M${start.x.toFixed(2)} ${start.y.toFixed(2)} A${r} ${r} 0 1 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`}
        fill="none"
        stroke="#fff"
        strokeWidth="5.5"
        strokeLinecap="butt"
      />
      <rect x="114" y="68" width="10" height="6" fill="#fff" />
      <rect x="102" y="81" width="5" height="35" fill="#fff" />
      <polygon points="114,81 124,81 124,155.5 114,165.5" fill="#fff" />
    </g>
  );
}

function PhotoGlyph() {
  // Traced from PhotographyIcon.png: 7 iris blades with a large
  // heptagonal opening, clockwise lean, and a continuous white ring.
  const n = 7;
  const step = 360 / n;
  const rOut = 47.2;
  const rIn = 25;
  const span = 42;
  const rot0 = -181;
  const leanStart = 24;
  const leanEnd = 18;

  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t0 = rot0 + i * step;
        const t1 = t0 + span;
        const i0 = t0 + leanStart;
        const i1 = t1 + leanEnd;
        const a = polar(CX, CY, rOut, t0);
        const b = polar(CX, CY, rOut, t1);
        const c = polar(CX, CY, rIn, i1);
        const d = polar(CX, CY, rIn, i0);
        return (
          <path
            key={i}
            d={`M${a.x.toFixed(2)} ${a.y.toFixed(2)} A${rOut} ${rOut} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)} L${c.x.toFixed(2)} ${c.y.toFixed(2)} A${rIn} ${rIn} 0 0 0 ${d.x.toFixed(2)} ${d.y.toFixed(2)} Z`}
            fill="#fff"
          />
        );
      })}
      <circle
        cx={CX}
        cy={CY}
        r={60}
        fill="none"
        stroke="#fff"
        strokeWidth="6"
      />
    </g>
  );
}

function VideoGlyph() {
  // Traced from VideoIcon.png: concentric equilateral play triangles.
  // Outer frame is drawn as 3 mitered corner chevrons + 3 side dashes so
  // each vertex stays a single stroke (a wrapped dasharray was splitting
  // the right tip and leaving a stray square on the bottom edge).
  const tl = { x: 91.5, y: 77.06 };
  const r = { x: 158.99, y: 116 };
  const bl = { x: 91.5, y: 154.94 };
  const side = 77.918;
  const at = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    s: number,
  ) => {
    const t = s / side;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };
  const pt = (p: { x: number; y: number }) =>
    `${p.x.toFixed(2)},${p.y.toFixed(2)}`;

  const topL = at(tl, r, 20);
  const topMidA = at(tl, r, 28);
  const topMidB = at(tl, r, 51);
  const topR = at(tl, r, 60);
  const botR = at(r, bl, 20);
  const botMidA = at(r, bl, 28);
  const botMidB = at(r, bl, 50);
  const botL = at(r, bl, 59);
  const leftL = at(bl, tl, 18);
  const leftMidA = at(bl, tl, 27);
  const leftMidB = at(bl, tl, 50);
  const leftT = at(bl, tl, 59);

  return (
    <g fill="none" stroke="#fff" strokeLinejoin="miter" strokeLinecap="butt">
      <polyline
        points={`${pt(leftT)} ${pt(tl)} ${pt(topL)}`}
        strokeWidth="7"
      />
      <polyline
        points={`${pt(topR)} ${pt(r)} ${pt(botR)}`}
        strokeWidth="7"
      />
      <polyline
        points={`${pt(botL)} ${pt(bl)} ${pt(leftL)}`}
        strokeWidth="7"
      />
      <line
        x1={topMidA.x}
        y1={topMidA.y}
        x2={topMidB.x}
        y2={topMidB.y}
        strokeWidth="7"
      />
      <line
        x1={botMidA.x}
        y1={botMidA.y}
        x2={botMidB.x}
        y2={botMidB.y}
        strokeWidth="7"
      />
      <line
        x1={leftMidA.x}
        y1={leftMidA.y}
        x2={leftMidB.x}
        y2={leftMidB.y}
        strokeWidth="7"
      />
      <polygon
        points="107.48,104.74 126.99,116 107.48,127.26"
        strokeWidth="6"
      />
    </g>
  );
}

function SculptorGlyph() {
  // Traced from 3DIcon.png: isometric cube with a closed top diamond,
  // gapped side brackets, a front vertical, and face ticks that point
  // toward the cube center (left = /, right = \).
  return (
    <g fill="none" stroke="#fff" strokeLinecap="butt" strokeLinejoin="miter">
      <path
        d="M115.74 72.37 L150.53 95.49 L115.48 113.01 L81.5 94.25 Z"
        strokeWidth="7"
      />
      <path d="M77 109 V136 L115.5 159 L154 136 V111" strokeWidth="7" />
      <path d="M115.5 113 V159" strokeWidth="7" />
      <path d="M115.5 85 V101" strokeWidth="6" />
      <path d="M101.5 119 L90 129" strokeWidth="7" />
      <path d="M129.5 119 L141 129" strokeWidth="7" />
    </g>
  );
}

function SkillGlyph({ id }: { id: SkillIconId }) {
  switch (id) {
    case "software-engineer":
      return <SoftwareGlyph />;
    case "visual-artist":
      return <ArtistGlyph />;
    case "photographer":
      return <PhotoGlyph />;
    case "video-editor":
      return <VideoGlyph />;
    case "3d-sculptor":
      return <SculptorGlyph />;
  }
}

/**
 * Vector rebuild of the What I Do skill badges (232×231 source).
 * Frame, disc glow, and glyphs are traced from the original PNGs.
 */
export function HomeWhatIDoSkillIcon({
  id,
  className = "",
}: HomeWhatIDoSkillIconProps) {
  const rawId = useId().replace(/:/g, "");
  const colors = FRAME[id];
  const rootClass = ["home-what-i-do-skill-icon", className].filter(Boolean).join(" ");

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={rootClass}
      aria-hidden
    >
      <CompassFrame
        colors={colors}
        glowId={`skill-glow-${rawId}`}
        discId={`skill-disc-${rawId}`}
      />
      <SkillGlyph id={id} />
    </svg>
  );
}
