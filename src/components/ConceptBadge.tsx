import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Tiny, removable "concept" marker. Toggle everywhere with siteConfig.showConceptBadge. */
export function ConceptBadge({ className }: { className?: string }) {
  if (!siteConfig.showConceptBadge) return null;
  return <p className={cn("text-[11px] font-medium tracking-wide", className)}>{siteConfig.conceptBadgeText}</p>;
}
