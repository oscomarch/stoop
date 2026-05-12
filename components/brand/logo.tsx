import { cn } from "@/lib/utils";

/**
 * The Stoop wordmark. A stylized "S" silhouette inspired by a brownstone stoop,
 * two angled steps leading up. Pairs with the wordmark in serif.
 */
export function Logo({
  className,
  showWord = true,
  size = 28,
}: {
  className?: string;
  showWord?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M4 26 H12 V22 H18 V18 H24 V14 H28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          className="text-terracotta-600"
        />
        <circle
          cx="6"
          cy="26"
          r="1.5"
          className="fill-terracotta-600"
        />
      </svg>
      {showWord && (
        <span
          className="font-serif text-xl font-semibold tracking-tight text-ink-900"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Stoop
        </span>
      )}
    </div>
  );
}
