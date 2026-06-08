/**
 * Hand-built SVG neighbors. Same flat, bold, neighborhood-zine language as the
 * brownstones: simple cut-paper shapes, dot eyes, a small smile. A figure is a
 * head-and-shoulders bust drawn to sit cleanly inside a circle, so the same
 * component works as a chat avatar or a larger character on a stoop.
 */

const INK = "#1a1a18";

export type HairStyle = "short" | "long" | "bun" | "curly" | "cap" | "buzz";

export type NeighborLook = {
  /** Skin fill. */
  skin: string;
  /** Hair fill, or the cap color when hairStyle is "cap". */
  hair: string;
  hairStyle: HairStyle;
  /** Shirt / shoulders fill. */
  shirt: string;
};

export function Neighbor({
  look,
  className,
  style,
}: {
  look: NeighborLook;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { skin, hair, hairStyle, shirt } = look;

  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* shoulders */}
      <path d="M6 96 C6 75 25 65 48 65 C71 65 90 75 90 96 Z" fill={shirt} />
      {/* simple collar notch */}
      <path
        d="M40 66 Q48 75 56 66"
        stroke={INK}
        strokeOpacity="0.12"
        strokeWidth="2"
        fill="none"
      />
      {/* neck */}
      <rect x="42" y="52" width="12" height="16" rx="5" fill={skin} />
      {/* ears */}
      <circle cx="27" cy="41" r="4.5" fill={skin} />
      <circle cx="69" cy="41" r="4.5" fill={skin} />

      {/* hair behind the face for every style except cap (cap goes on top) */}
      {hairStyle !== "cap" && <HairBack style={hairStyle} color={hair} />}

      {/* head */}
      <circle cx="48" cy="40" r="22" fill={skin} />

      {/* face */}
      <circle cx="40.5" cy="40" r="2.4" fill={INK} />
      <circle cx="55.5" cy="40" r="2.4" fill={INK} />
      <path
        d="M41 47.5 Q48 53.5 55 47.5"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* warm cheeks */}
      <circle cx="34" cy="46" r="3.2" fill="#d3674a" opacity="0.18" />
      <circle cx="62" cy="46" r="3.2" fill="#d3674a" opacity="0.18" />

      {/* hair / cap drawn over the forehead */}
      <HairFront style={hairStyle} color={hair} />
    </svg>
  );
}

/** Hair volume that sits behind the head (crown, sides, bun). */
function HairBack({ style, color }: { style: HairStyle; color: string }) {
  return (
    <>
      {style === "long" && (
        <>
          <rect x="21" y="34" width="9" height="30" rx="4.5" fill={color} />
          <rect x="66" y="34" width="9" height="30" rx="4.5" fill={color} />
        </>
      )}
      {style === "bun" && <circle cx="48" cy="13" r="7" fill={color} />}
      {/* crown blob, nudged up so only the hairline shows past the face */}
      {style !== "curly" && <circle cx="48" cy="33" r="24" fill={color} />}
      {style === "curly" &&
        [
          [29, 30],
          [38, 22],
          [48, 19],
          [58, 22],
          [67, 30],
          [33, 40],
          [63, 40],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" fill={color} />
        ))}
    </>
  );
}

/** Hairline / fringe / cap drawn on top of the face. */
function HairFront({ style, color }: { style: HairStyle; color: string }) {
  if (style === "cap") {
    return (
      <>
        {/* dome */}
        <path d="M27 36 A21 21 0 0 1 69 36 Q48 30 27 36 Z" fill={color} />
        {/* brim to the right */}
        <path d="M61 35 q16 -1 19 5 q-3 4 -19 1 z" fill={color} />
        {/* button */}
        <circle cx="48" cy="20" r="2" fill={color} />
      </>
    );
  }
  if (style === "buzz") {
    return <path d="M28 36 Q48 27 68 36 Q48 32 28 36 Z" fill={color} opacity="0.9" />;
  }
  // soft fringe across the forehead for the rest
  return (
    <path
      d="M27 38 Q31 27 48 27 Q65 27 69 38 Q60 32 48 32 Q36 32 27 38 Z"
      fill={color}
    />
  );
}

const HIP = {
  transformBox: "fill-box",
  transformOrigin: "center top",
} as React.CSSProperties;

/**
 * A full-body neighbor for the street. Same face and palette as the bust, with
 * legs and arms that swing from the hip and shoulder. The walk is pure CSS
 * (see globals.css), so a parent only has to move the figure across the
 * sidewalk. When motion is reduced the limbs sit straight and it simply stands.
 */
export type ToolKind = "none" | "wrench" | "plant" | "bulb" | "roller";

export function Walker({
  look,
  pants = "#37322e",
  worker = false,
  walking = true,
  vest = "#d6e34a",
  helmet = "#f2b705",
  stripe = "#eef1ee",
  tool = "none",
  className,
  style,
}: {
  look: NeighborLook;
  pants?: string;
  /** Hi-vis vest + hard hat, so pros read differently from neighbors. */
  worker?: boolean;
  /** Animate the walk cycle. Set false for a standing figure. */
  walking?: boolean;
  vest?: string;
  helmet?: string;
  stripe?: string;
  /** A tool held at the side. Only use on a standing (non-walking) figure. */
  tool?: ToolKind;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { skin, hair, hairStyle, shirt } = look;
  const step = walking ? "stoop-step" : undefined;
  const swing = walking ? "stoop-swing" : undefined;

  return (
    <svg
      viewBox="0 0 56 104"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g
        className={walking ? "stoop-walk-bob" : undefined}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        {/* legs */}
        <g className={step} style={HIP}>
          <rect x="18" y="69" width="9" height="25" rx="4.5" fill={pants} />
          <ellipse cx="22.5" cy="95" rx="6.2" ry="3.1" fill={INK} />
        </g>
        <g className={step} style={{ ...HIP, animationDelay: "-0.31s" }}>
          <rect x="29" y="69" width="9" height="25" rx="4.5" fill={pants} />
          <ellipse cx="33.5" cy="95" rx="6.2" ry="3.1" fill={INK} />
        </g>

        {/* arms behind the torso, hands in skin */}
        <g className={swing} style={{ ...HIP, animationDelay: "-0.31s" }}>
          <rect x="11" y="45" width="6.5" height="22" rx="3.25" fill={shirt} />
          <circle cx="14.25" cy="67" r="3.4" fill={skin} />
        </g>
        <g className={swing} style={HIP}>
          <rect x="38.5" y="45" width="6.5" height="22" rx="3.25" fill={shirt} />
          <circle cx="41.75" cy="67" r="3.4" fill={skin} />
        </g>

        {/* torso */}
        <rect x="16" y="40" width="24" height="31" rx="10" fill={shirt} />
        {worker && <WorkerVest vest={vest} stripe={stripe} />}
        {/* neck */}
        <rect x="24" y="33" width="8" height="11" rx="4" fill={skin} />

        {/* head + hair (or hard hat for workers) */}
        {!worker && hairStyle !== "cap" && (
          <WalkerHairBack style={hairStyle} color={hair} />
        )}
        {worker && (
          <>
            <rect x="12" y="24" width="5" height="9" rx="2.5" fill={hair} />
            <rect x="39" y="24" width="5" height="9" rx="2.5" fill={hair} />
          </>
        )}
        <circle cx="28" cy="24" r="16" fill={skin} />
        <circle cx="22.5" cy="24" r="2" fill={INK} />
        <circle cx="33.5" cy="24" r="2" fill={INK} />
        <path
          d="M24 30 Q28 33.5 32 30"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="18.5" cy="28.5" r="2.4" fill="#d3674a" opacity="0.18" />
        <circle cx="37.5" cy="28.5" r="2.4" fill="#d3674a" opacity="0.18" />
        {worker ? (
          <WorkerHelmet helmet={helmet} />
        ) : (
          <WalkerHairFront style={hairStyle} color={hair} />
        )}
        {tool !== "none" && <WorkerTool kind={tool} />}
      </g>
    </svg>
  );
}

/** A small tool held at the figure's right side, to hint at the trade. */
function WorkerTool({ kind }: { kind: ToolKind }) {
  if (kind === "wrench") {
    return (
      <g>
        <rect x="40.4" y="64" width="3.6" height="27" rx="1.8" fill="#8b949a" />
        <path
          d="M37.5 56.5 a6 6 0 0 1 9.4 0.4 l-2.6 2.1 a3 3 0 0 0 -4.3 -0.2 z"
          fill="#8b949a"
        />
        <rect x="40.4" y="64" width="3.6" height="27" rx="1.8" fill={INK} opacity="0.1" />
      </g>
    );
  }
  if (kind === "plant") {
    return (
      <g>
        <circle cx="43.5" cy="69" r="5" fill="#6f9a5e" />
        <circle cx="39.5" cy="71.5" r="4" fill="#7faa6c" />
        <circle cx="47" cy="72" r="3.6" fill="#5f8a50" />
        <path d="M38.5 77 h11 l-1.6 11 h-7.8 z" fill="#bf6a4a" />
        <rect x="38" y="76" width="12" height="3" rx="1" fill="#cf7a59" />
      </g>
    );
  }
  if (kind === "bulb") {
    return (
      <g>
        <circle cx="43.5" cy="69" r="5.6" fill="#f6d35a" />
        <circle cx="43.5" cy="69" r="5.6" fill="#fff3c4" opacity="0.4" />
        <rect x="40.7" y="73.5" width="5.6" height="3.4" rx="1" fill="#9aa3a8" />
        <rect x="41.4" y="77" width="4.2" height="2.2" rx="1" fill="#7d868b" />
      </g>
    );
  }
  if (kind === "roller") {
    return (
      <g>
        <rect x="37.5" y="57" width="12.5" height="6" rx="2.4" fill="#7796a0" />
        <path d="M43.5 63 v3.5 h-2.2 v-2" fill="none" stroke="#8b949a" strokeWidth="1.6" />
        <rect x="41.6" y="66" width="3" height="25" rx="1.5" fill="#8b949a" />
      </g>
    );
  }
  return null;
}

/** Open hi-vis vest worn over the shirt, with reflective tape. */
function WorkerVest({ vest, stripe }: { vest: string; stripe: string }) {
  return (
    <g>
      {/* collar across the shoulders */}
      <path d="M17 41 Q28 47 39 41 L39 45 Q28 50 17 45 Z" fill={vest} />
      {/* front panels, open down the middle */}
      <path d="M16 44 L26 47 L26 71 L19 71 Q16 71 16 67 Z" fill={vest} />
      <path d="M40 44 L30 47 L30 71 L37 71 Q40 71 40 67 Z" fill={vest} />
      {/* reflective tape: vertical bands + a waist band on each panel */}
      <rect x="19.5" y="48" width="2.4" height="23" fill={stripe} opacity="0.9" />
      <rect x="34.1" y="48" width="2.4" height="23" fill={stripe} opacity="0.9" />
      <rect x="16" y="59" width="10" height="2.6" fill={stripe} opacity="0.9" />
      <rect x="30" y="59" width="10" height="2.6" fill={stripe} opacity="0.9" />
    </g>
  );
}

/** A hard hat: dome, brim, and a center ridge. */
function WorkerHelmet({ helmet }: { helmet: string }) {
  return (
    <g>
      <path d="M11 21 Q11 4 28 4 Q45 4 45 21 Z" fill={helmet} />
      <ellipse cx="28" cy="21" rx="18.5" ry="4.3" fill={helmet} />
      <ellipse cx="28" cy="22" rx="18.5" ry="4.3" fill={INK} opacity="0.1" />
      <rect x="26" y="5" width="4" height="14" rx="2" fill={INK} opacity="0.08" />
    </g>
  );
}

function WalkerHairBack({ style, color }: { style: HairStyle; color: string }) {
  return (
    <>
      {style === "long" && (
        <>
          <rect x="11" y="22" width="6" height="20" rx="3" fill={color} />
          <rect x="39" y="22" width="6" height="20" rx="3" fill={color} />
        </>
      )}
      {style === "bun" && <circle cx="28" cy="6" r="5" fill={color} />}
      {style !== "curly" && <circle cx="28" cy="20" r="16.5" fill={color} />}
      {style === "curly" &&
        [
          [16, 18],
          [23, 12],
          [33, 12],
          [40, 18],
          [20, 27],
          [36, 27],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" fill={color} />
        ))}
    </>
  );
}

function WalkerHairFront({ style, color }: { style: HairStyle; color: string }) {
  if (style === "cap") {
    return (
      <>
        <path d="M14 19 A15 15 0 0 1 42 19 Q28 13 14 19 Z" fill={color} />
        <path d="M36 18 q15 -1 18 4 q-3 4 -18 1 z" fill={color} />
        <circle cx="28" cy="5.5" r="1.8" fill={color} />
      </>
    );
  }
  if (style === "buzz") {
    return <path d="M15 19 Q28 11 41 19 Q28 15 15 19 Z" fill={color} opacity="0.9" />;
  }
  return (
    <path
      d="M14 19 Q18 10 28 10 Q38 10 42 19 Q35 14 28 14 Q21 14 14 19 Z"
      fill={color}
    />
  );
}
