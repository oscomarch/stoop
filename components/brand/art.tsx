import { cn } from "@/lib/utils";

/**
 * Hand-built SVG brand art. Flat, bold, neighborhood-zine style. All shapes use
 * brand tokens so a row of them reads as one block. No external image assets.
 */

export type BrownstoneTone = "brick" | "rust" | "clay" | "limestone" | "ink";

const TONES: Record<
  BrownstoneTone,
  { body: string; trim: string; roof: string; door: string }
> = {
  brick: { body: "#c24f37", trim: "#a23e2c", roof: "#82342a", door: "#3a1612" },
  rust: { body: "#a23e2c", trim: "#82342a", roof: "#6b2e26", door: "#2a0f0c" },
  clay: { body: "#e08568", trim: "#c24f37", roof: "#a23e2c", door: "#6b2e26" },
  limestone: { body: "#ddb877", trim: "#cfa056", roof: "#a98643", door: "#6b4f26" },
  ink: { body: "#3f3f3b", trim: "#2a2a27", roof: "#1a1a18", door: "#0e0e0d" },
};

/**
 * A single brownstone elevation: cornice, two columns of windows, a raised
 * parlor door, and the namesake stoop. `lit` warms the windows so the block
 * feels lived-in.
 */
export function Brownstone({
  tone = "brick",
  lit = true,
  className,
  style,
}: {
  tone?: BrownstoneTone;
  lit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const c = TONES[tone];
  const glass = lit ? "#fbe8df" : "#2a2a27";
  const glassOpacity = lit ? 0.95 : 0.55;

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
      {/* cornice */}
      <rect x="14" y="26" width="132" height="16" fill={c.roof} />
      <rect x="14" y="42" width="132" height="4" fill={c.trim} />
      {/* dentils */}
      {Array.from({ length: 11 }).map((_, i) => (
        <rect key={i} x={20 + i * 12} y="34" width="6" height="6" fill={c.body} opacity="0.5" />
      ))}

      {/* upper-floor windows: two columns, three rows */}
      {[68, 124, 180].map((y) =>
        [44, 96].map((x) => (
          <g key={`${x}-${y}`}>
            <rect x={x - 3} y={y - 5} width="26" height="5" fill={c.trim} />
            <rect x={x} y={y} width="20" height="40" fill={glass} opacity={glassOpacity} />
            <rect
              x={x}
              y={y}
              width="20"
              height="40"
              stroke={c.door}
              strokeWidth="2"
              fill="none"
            />
            <line x1={x + 10} y1={y} x2={x + 10} y2={y + 40} stroke={c.door} strokeWidth="1.5" />
            <rect x={x - 4} y={y + 40} width="28" height="4" fill={c.trim} />
          </g>
        ))
      )}

      {/* parlor door (raised, reached by the stoop) */}
      <rect x="92" y="232" width="30" height="54" fill={c.door} />
      <path d="M92 232 a15 15 0 0 1 30 0" fill={c.door} />
      <path d="M95 230 a12 12 0 0 1 24 0" fill={glass} opacity={glassOpacity} />
      <circle cx="116" cy="262" r="2" fill={c.body} />

      {/* garden-level window */}
      <rect x="38" y="250" width="30" height="30" fill={glass} opacity={glassOpacity} />
      <rect x="38" y="250" width="30" height="30" stroke={c.door} strokeWidth="2" fill="none" />

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

/** A simple street tree to set between brownstones. */
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
      <circle cx="40" cy="150" r="38" fill="#6b8e5a" />
      <circle cx="20" cy="168" r="24" fill="#557547" />
      <circle cx="60" cy="166" r="26" fill="#557547" />
      <circle cx="40" cy="128" r="26" fill="#7da06a" />
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
