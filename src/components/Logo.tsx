import { cn } from "@/lib/cn";

/**
 * Typographic rendition of the Fine Line Homes wordmark (boxed FINE | LINE,
 * HOMES set into the bottom rule, 50 YEARS tab). Swap for the official vector
 * logo when it is supplied.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span
      className={cn("relative inline-flex flex-col items-center border-x border-t border-current", compact ? "mb-1" : "mb-1.5", className)}
      role="img"
      aria-label="Fine Line Homes — 50 Years"
    >
      <span aria-hidden="true" className="-mt-[7px] bg-accent px-1.5 text-[8px] leading-[14px] font-semibold tracking-[0.14em] whitespace-nowrap text-white">
        50 YEARS
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center font-serif leading-none tracking-[0.06em]",
          compact ? "gap-2 px-3 pt-1.5 pb-3 text-[17px]" : "gap-2.5 px-4 pt-2 pb-3.5 text-[20px]",
        )}
      >
        FINE
        <span className="h-[0.95em] w-[2px] bg-accent-soft" />
        LINE
      </span>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 flex translate-y-1/2 items-center gap-1.5">
        <span className="h-px flex-1 bg-current" />
        <span className="text-[9px] leading-none font-medium tracking-[0.42em] pl-[0.42em]">HOMES</span>
        <span className="h-px flex-1 bg-current" />
      </span>
    </span>
  );
}
