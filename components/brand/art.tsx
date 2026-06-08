/**
 * Hand-built SVG brand art. Flat, bold, neighborhood-zine style. All shapes use
 * brand tokens so a row of them reads as one block. No external image assets.
 */

export type BrownstoneTone = "brick" | "rust" | "clay" | "limestone" | "ink";

const TONES: Record<
  BrownstoneTone,
  { body: string; trim: string; roof: string; door: string; sill: string }
> = {
  brick: { body: "#c24f37", trim: "#a23e2c", roof: "#82342a", door: "#3a1612", sill: "#d98a6f" },
  rust: { body: "#a23e2c", trim: "#82342a", roof: "#6b2e26", door: "#2a0f0c", sill: "#c06044" },
  clay: { body: "#e08568", trim: "#c24f37", roof: "#a23e2c", door: "#6b2e26", sill: "#f0a98f" },
  limestone: { body: "#ddb877", trim: "#cfa056", roof: "#a98643", door: "#6b4f26", sill: "#ecd2a0" },
  ink: { body: "#3f3f3b", trim: "#2a2a27", roof: "#1a1a18", door: "#0e0e0d", sill: "#56564f" },
};

// Warm lamplight palette for windows after dark.
const GLOW = "#ffd596";
const GLOW_SOFT = "#ffbf76";
const NIGHT_GLASS = "#241f1d";

type RoofStyle = "cornice" | "parapet" | "gable" | "mansard";
type Detail = "chimney" | "flowerbox" | "awning" | "ac" | "none";

type Variant = {
  roof: RoofStyle;
  detail: Detail;
  /** Per-window warmth, read top-left to bottom-right across 3 rows x 2 cols. */
  lit: number[];
  /** Index of the window that flickers, or -1 for none. */
  flicker: number;
  number: string;
};

const VARIANTS: Variant[] = [
  { roof: "cornice", detail: "chimney", lit: [1, 0.65, 0.9, 1, 0.45, 0.85], flicker: 3, number: "44" },
  { roof: "parapet", detail: "flowerbox", lit: [0.8, 1, 0, 0.9, 1, 0.6], flicker: -1, number: "46" },
  { roof: "gable", detail: "awning", lit: [1, 0.85, 0.7, 0, 0.9, 1], flicker: 5, number: "12" },
  { roof: "mansard", detail: "ac", lit: [0.6, 0.95, 1, 0.8, 0.7, 0], flicker: -1, number: "9" },
  { roof: "cornice", detail: "flowerbox", lit: [0.9, 0, 0.85, 1, 0.6, 0.9], flicker: 0, number: "21" },
  { roof: "parapet", detail: "chimney", lit: [1, 0.8, 0.55, 0.95, 0, 1], flicker: 4, number: "7" },
];

const ROWS = [70, 126, 182];
const COLS = [44, 96];
const WIN_W = 20;
const WIN_H = 40;

/**
 * A single brownstone elevation. Window warmth is driven by the inherited
 * `--lit` custom property (0 dark, 1 fully lit) so a parent can make a whole
 * block glow on scroll or follow the cursor. Falls back to a warm resting
 * state when nothing sets it, so static rows still read as lived-in.
 */
export function Brownstone({
  tone = "brick",
  variant = 0,
  className,
  style,
}: {
  tone?: BrownstoneTone;
  variant?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const c = TONES[tone];
  const v = VARIANTS[((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length];

  const litStyle: React.CSSProperties = {
    opacity: "var(--lit, 0.8)" as unknown as number,
    transition: "opacity 380ms ease",
  };

  return (
    <svg
      viewBox="0 0 160 300"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* facade */}
      <rect x="22" y="40" width="116" height="260" fill={c.body} />
      {/* faint floor courses for texture */}
      {[114, 170].map((y) => (
        <rect key={y} x="22" y={y} width="116" height="2" fill={c.trim} opacity="0.35" />
      ))}

      <Roofline style={v.roof} c={c} />
      <Detailing detail={v.detail} c={c} />

      {/* window frames + dark glass (always visible) */}
      {ROWS.map((y, r) =>
        COLS.map((x, col) => {
          const k = r * 2 + col;
          return (
            <g key={`f${k}`}>
              <rect x={x - 4} y={y - 7} width={28} height={7} fill={c.trim} />
              <rect x={x} y={y} width={WIN_W} height={WIN_H} fill={NIGHT_GLASS} />
              <rect x={x} y={y} width={WIN_W} height={WIN_H} stroke={c.door} strokeWidth="2" fill="none" />
              <rect x={x - 4} y={y + WIN_H} width={28} height={4} fill={c.sill} />
            </g>
          );
        })
      )}

      {/* warm lit layer: fades in/out with --lit */}
      <g style={litStyle}>
        {ROWS.map((y, r) =>
          COLS.map((x, col) => {
            const k = r * 2 + col;
            const f = v.lit[k] ?? 0.8;
            if (f <= 0) return null;
            const flick = k === v.flicker;
            return (
              <g
                key={`l${k}`}
                className={flick ? "stoop-flicker" : undefined}
                style={flick ? { transformBox: "fill-box", transformOrigin: "center" } : undefined}
              >
                <rect x={x - 8} y={y - 8} width={36} height={56} rx={8} fill={GLOW_SOFT} opacity={0.3 * f} />
                <rect x={x} y={y} width={WIN_W} height={WIN_H} fill={GLOW} opacity={0.94 * f} />
                <line x1={x + WIN_W / 2} y1={y} x2={x + WIN_W / 2} y2={y + WIN_H} stroke={c.door} strokeWidth="1.4" opacity="0.75" />
                <line x1={x} y1={y + WIN_H / 2} x2={x + WIN_W} y2={y + WIN_H / 2} stroke={c.door} strokeWidth="1" opacity="0.55" />
              </g>
            );
          })
        )}
        {/* door fan light */}
        <path d="M95 230 a12 12 0 0 1 24 0" fill={GLOW} opacity="0.9" />
      </g>

      {/* mullions over dark glass so frames read when unlit */}
      {ROWS.map((y, r) =>
        COLS.map((x, col) => {
          const k = r * 2 + col;
          return (
            <line
              key={`m${k}`}
              x1={x + WIN_W / 2}
              y1={y}
              x2={x + WIN_W / 2}
              y2={y + WIN_H}
              stroke={c.door}
              strokeWidth="1.4"
              opacity="0.5"
            />
          );
        })
      )}

      {/* parlor door (raised, reached by the stoop) */}
      <rect x="92" y="232" width="30" height="54" fill={c.door} />
      <path d="M92 232 a15 15 0 0 1 30 0" fill={c.door} />
      <circle cx="116" cy="262" r="2" fill={c.sill} />

      {/* house number plaque */}
      <rect x="70" y="236" width="16" height="11" rx="2" fill={c.trim} />
      <text
        x="78"
        y="245"
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-geist-mono), monospace"
        fontWeight="600"
        fill={c.sill}
      >
        {v.number}
      </text>

      {/* garden-level window */}
      <rect x="38" y="252" width="30" height="28" fill={NIGHT_GLASS} />
      <rect x="38" y="252" width="30" height="28" stroke={c.door} strokeWidth="2" fill="none" />

      {/* the stoop */}
      <rect x="84" y="286" width="50" height="14" fill={c.trim} />
      <rect x="90" y="274" width="38" height="14" fill={c.roof} />
      <rect x="96" y="262" width="26" height="14" fill={c.trim} />
      {/* railing */}
      <line x1="86" y1="286" x2="120" y2="258" stroke={c.door} strokeWidth="3" strokeLinecap="round" />
      <line x1="132" y1="300" x2="120" y2="258" stroke={c.door} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Roofline({ style, c }: { style: RoofStyle; c: (typeof TONES)[BrownstoneTone] }) {
  if (style === "gable") {
    return (
      <>
        <path d="M22 42 L80 8 L138 42 Z" fill={c.roof} />
        <path d="M22 42 L80 8 L138 42 Z" stroke={c.door} strokeWidth="2" fill="none" opacity="0.4" />
        <rect x="14" y="40" width="132" height="6" fill={c.trim} />
      </>
    );
  }
  if (style === "mansard") {
    return (
      <>
        <path d="M18 46 L30 16 L130 16 L142 46 Z" fill={c.roof} />
        {/* dormers */}
        {[52, 92].map((x) => (
          <g key={x}>
            <rect x={x} y={24} width="16" height="18" fill={c.trim} />
            <rect x={x + 2} y={26} width="12" height="14" fill={NIGHT_GLASS} />
          </g>
        ))}
        <rect x="14" y="42" width="132" height="6" fill={c.trim} />
      </>
    );
  }
  if (style === "parapet") {
    return (
      <>
        <rect x="14" y="26" width="132" height="18" fill={c.roof} />
        <rect x="58" y="14" width="44" height="14" fill={c.roof} />
        <rect x="58" y="14" width="44" height="4" fill={c.trim} />
        <rect x="14" y="44" width="132" height="4" fill={c.trim} />
      </>
    );
  }
  // cornice (default): dentils under a heavy crown
  return (
    <>
      <rect x="14" y="26" width="132" height="16" fill={c.roof} />
      <rect x="14" y="42" width="132" height="4" fill={c.trim} />
      {Array.from({ length: 11 }).map((_, i) => (
        <rect key={i} x={20 + i * 12} y="34" width="6" height="6" fill={c.body} opacity="0.5" />
      ))}
    </>
  );
}

function Detailing({ detail, c }: { detail: Detail; c: (typeof TONES)[BrownstoneTone] }) {
  if (detail === "chimney") {
    return (
      <>
        <rect x="116" y="6" width="14" height="24" fill={c.roof} />
        <rect x="113" y="3" width="20" height="5" fill={c.trim} />
        <g
          className="stoop-smoke"
          style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
        >
          <circle cx="123" cy="0" r="4" fill="#cdbfb0" opacity="0" />
          <circle cx="126" cy="-4" r="5" fill="#cdbfb0" opacity="0" style={{ animationDelay: "1.1s" }} />
          <circle cx="121" cy="-8" r="6" fill="#cdbfb0" opacity="0" style={{ animationDelay: "2.2s" }} />
        </g>
      </>
    );
  }
  if (detail === "flowerbox") {
    return (
      <g>
        <rect x="40" y="167" width="28" height="8" rx="1.5" fill={c.door} />
        <circle cx="46" cy="166" r="3" fill="#c24f37" />
        <circle cx="54" cy="165" r="3" fill="#ddb877" />
        <circle cx="62" cy="166" r="3" fill="#7da06a" />
      </g>
    );
  }
  if (detail === "awning") {
    return (
      <g>
        <path d="M84 226 L130 226 L136 240 L78 240 Z" fill="#a23e2c" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${90 + i * 14} 226 L${96 + i * 14} 240 L${90 + i * 14} 240 Z`}
            fill="#e08568"
            opacity="0.7"
          />
        ))}
      </g>
    );
  }
  if (detail === "ac") {
    return (
      <g>
        <rect x="98" y={182 + WIN_H} width="18" height="11" fill="#9a9a92" />
        <rect x="98" y={182 + WIN_H} width="18" height="3" fill="#6f6f68" />
      </g>
    );
  }
  return null;
}

/** A simple street tree to set between brownstones, with a gentle sway. */
export function StreetTree({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 80 300"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="36" y="170" width="8" height="130" fill="#6b4f26" />
      {/* tree pit */}
      <rect x="22" y="296" width="36" height="4" fill="#2a2a27" opacity="0.5" />
      <g className="stoop-sway" style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}>
        <circle cx="40" cy="150" r="38" fill="#6b8e5a" />
        <circle cx="20" cy="168" r="24" fill="#557547" />
        <circle cx="60" cy="166" r="26" fill="#557547" />
        <circle cx="40" cy="128" r="26" fill="#7da06a" />
      </g>
    </svg>
  );
}

/** Bold filled stoop mark for the logo: three steps rising to a doorway. */
export function StoopMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <rect x="3" y="22" width="9" height="7" rx="1.5" className="fill-terracotta-700" />
      <rect x="11" y="16" width="9" height="13" rx="1.5" className="fill-terracotta-600" />
      <rect x="19" y="8" width="10" height="21" rx="1.5" className="fill-terracotta-500" />
      <path d="M24 29 V18 a3 3 0 0 1 6 0 V29 Z" className="fill-cream-50" opacity="0.9" />
      <circle cx="28.5" cy="23.5" r="1" className="fill-terracotta-700" />
    </svg>
  );
}
