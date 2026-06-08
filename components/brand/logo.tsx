import { cn } from "@/lib/utils";
import { StoopMark } from "@/components/brand/art";

/**
 * The Stoop wordmark. A bold stepped stoop mark rising to a doorway, paired
 * with the wordmark set in Familjen Grotesk.
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
      <StoopMark size={size} />
      {showWord && (
        <span className="font-serif text-xl font-semibold tracking-tight">
          Stoop
        </span>
      )}
    </div>
  );
}
