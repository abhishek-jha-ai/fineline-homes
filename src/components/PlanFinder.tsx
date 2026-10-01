"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { featuredPlans, plans, planStyles } from "@/data/plans";
import { regions, type RegionId } from "@/data/regions";
import { activeCriteriaCount, matchPlans, type PlanCriteria } from "@/lib/planMatch";
import { trackEvent, trackEventOnce } from "@/lib/analytics";
import { useDialog } from "@/lib/useDialog";
import { useSite } from "./SiteProvider";
import { PlanCard } from "./PlanCard";
import { ArrowRight, Close, Sliders } from "./icons";
import { cn } from "@/lib/cn";

type Option<V extends string> = { value: V; label: string };
type LocalCriteria = Omit<PlanCriteria, "region">;

const emptyCriteria: LocalCriteria = { beds: "any", baths: "any", size: "any", stories: "any", style: "any" };

const bedOptions: Option<PlanCriteria["beds"]>[] = [
  { value: "any", label: "Any" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];
const bathOptions: Option<PlanCriteria["baths"]>[] = [
  { value: "any", label: "Any" },
  { value: "2", label: "2+" },
  { value: "2.5", label: "2.5+" },
  { value: "3", label: "3+" },
  { value: "3.5", label: "3.5+" },
];
const sizeOptions: Option<PlanCriteria["size"]>[] = [
  { value: "any", label: "Any size" },
  { value: "under-2000", label: "Under 2,000" },
  { value: "2000-2500", label: "2,000–2,500" },
  { value: "2500-3000", label: "2,500–3,000" },
  { value: "3000-plus", label: "3,000+" },
];
const storyOptions: Option<PlanCriteria["stories"]>[] = [
  { value: "any", label: "No preference" },
  { value: "1", label: "One-story" },
  { value: "2", label: "Two-story" },
];
const styleOptions: Option<PlanCriteria["style"]>[] = [{ value: "any", label: "Any style" }, ...planStyles.map((s) => ({ value: s, label: s }))];
const regionOptions: Option<PlanCriteria["region"]>[] = [{ value: "any", label: "Any" }, ...regions.map((r) => ({ value: r.id, label: r.shortName }))];

function labelFor<V extends string>(options: Option<V>[], value: V) {
  return options.find((o) => o.value === value)?.label ?? value;
}

function ChipGroup<V extends string>({
  label,
  options,
  value,
  onChange,
  idPrefix,
  compact,
}: {
  label: string;
  options: Option<V>[];
  value: V;
  onChange: (v: V) => void;
  idPrefix: string;
  compact?: boolean;
}) {
  const id = `${idPrefix}-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div role="radiogroup" aria-labelledby={id}>
      <p id={id} className="mb-2.5 text-[13px] font-semibold tracking-wide">
        {label}
      </p>
      <div className={cn("flex flex-wrap", compact ? "gap-1.5" : "gap-2")}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} className={cn("chip whitespace-nowrap", compact && "!min-h-9 !px-3 !text-[13px]")}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Controls({
  full,
  update,
  idPrefix,
  compact,
}: {
  full: PlanCriteria;
  update: <K extends keyof PlanCriteria>(k: K, v: PlanCriteria[K]) => void;
  idPrefix: string;
  compact?: boolean;
}) {
  const shared = { idPrefix, compact };
  return (
    <div className={compact ? "space-y-5" : "space-y-6"}>
      <ChipGroup {...shared} label="Where are you building?" options={regionOptions} value={full.region} onChange={(v) => update("region", v)} />
      <ChipGroup {...shared} label="Bedrooms" options={bedOptions} value={full.beds} onChange={(v) => update("beds", v)} />
      <ChipGroup {...shared} label="Bathrooms" options={bathOptions} value={full.baths} onChange={(v) => update("baths", v)} />
      <ChipGroup {...shared} label="Approximate size (sq ft)" options={sizeOptions} value={full.size} onChange={(v) => update("size", v)} />
      <ChipGroup {...shared} label="Stories" options={storyOptions} value={full.stories} onChange={(v) => update("stories", v)} />
      <ChipGroup {...shared} label="Style" options={styleOptions} value={full.style} onChange={(v) => update("style", v)} />
    </div>
  );
}

/**
 * The home-plan explorer: featured plans by default, live matching as soon as
 * a buyer sets any preference. Desktop shows the finder as a sidebar; phones
 * get a bottom sheet so plans stay front and center.
 */
export function PlanFinder() {
  const { region, selectRegion, startConsultation } = useSite();
  const reduce = useReducedMotion();
  const resultsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [criteria, setCriteria] = useState<LocalCriteria>(emptyCriteria);
  const [showAll, setShowAll] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useDialog<HTMLDivElement>(sheetOpen, () => setSheetOpen(false));

  // Region is shared site-wide so the region selector, finder and consultation stay in sync.
  const full: PlanCriteria = { ...criteria, region: region ?? "any" };
  const active = activeCriteriaCount(full);

  const matches = matchPlans(plans, full);
  const exact = active ? matches.filter((m) => m.exact).map((m) => m.plan) : showAll ? plans : featuredPlans;
  const close = active ? matches.filter((m) => !m.exact).slice(0, exact.length ? 2 : 3) : [];

  function update<K extends keyof PlanCriteria>(key: K, value: PlanCriteria[K]) {
    trackEvent("plan_filter_used", { filter: key, value });
    if (key === "region") {
      selectRegion(value === "any" ? null : (value as RegionId), "plan_finder");
      return;
    }
    setCriteria((c) => ({ ...c, [key]: value }));
  }

  function reset() {
    setCriteria(emptyCriteria);
    selectRegion(null, "plan_finder_reset");
    trackEvent("plan_filter_used", { filter: "reset", value: "all" });
  }

  // Phones show results as a swipeable row — start it from the first card whenever results change.
  const resultKey = `${full.region}|${full.beds}|${full.baths}|${full.size}|${full.stories}|${full.style}|${showAll}`;
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0 });
  }, [resultKey]);

  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  const activeChips = [
    full.region !== "any" && labelFor(regionOptions, full.region),
    full.beds !== "any" && `${full.beds}+ beds`,
    full.baths !== "any" && `${full.baths}+ baths`,
    full.size !== "any" && `${labelFor(sizeOptions, full.size)} sq ft`,
    full.stories !== "any" && labelFor(storyOptions, full.stories),
    full.style !== "any" && full.style,
  ].filter(Boolean) as string[];

  const summary =
    active === 0
      ? showAll
        ? `All ${plans.length} home plans`
        : "Featured home plans"
      : exact.length
        ? `${exact.length} ${exact.length === 1 ? "plan matches" : "plans match"} your preferences`
        : "No exact matches — here are the closest plans";

  const cardSizes = "(min-width: 1024px) 440px, (min-width: 640px) 45vw, 82vw";

  return (
    <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-12 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside id="plan-finder" aria-labelledby="finder-heading" className="scroll-mt-24 max-lg:hidden lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-sm border border-line bg-white p-5 xl:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 id="finder-heading" className="font-serif text-xl">
                Help Me Find My Home
              </h3>
              <p className="mt-1 text-sm text-stone">Results update as you choose.</p>
            </div>
            {active > 0 && (
              <button type="button" onClick={reset} className="mt-1 text-sm font-medium text-accent-ink underline-offset-4 hover:underline">
                Reset
              </button>
            )}
          </div>
          <div className="mt-5 border-t border-line pt-5">
            <Controls full={full} update={update} idPrefix="finder-desktop" compact />
          </div>
        </div>
      </aside>

      <div ref={resultsRef} className="min-w-0 scroll-mt-20">
        {/* Mobile / tablet finder launcher */}
        <div id="plan-finder-mobile" className="mb-6 scroll-mt-20 rounded-sm border border-line bg-white p-5 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl">Help Me Find My Home</h3>
              <p className="mt-1 text-sm text-stone">{active ? `${active} preference${active > 1 ? "s" : ""} set` : "Match plans by beds, size, style & region"}</p>
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="btn btn-primary shrink-0 !min-h-11 !px-4 text-sm"
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
            >
              <Sliders size={16} /> {active ? "Edit" : "Start"}
            </button>
          </div>
          {activeChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map((c) => (
                <span key={c} className="rounded-full bg-sand px-3 py-1 text-[13px]">
                  {c}
                </span>
              ))}
              <button type="button" onClick={reset} className="px-1 text-[13px] font-medium text-accent-ink underline underline-offset-4">
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="mb-5 flex items-baseline justify-between gap-4">
          <p className="font-serif text-xl sm:text-2xl" aria-live="polite">
            {summary}
          </p>
          {active === 0 && (
            <button type="button" onClick={() => setShowAll((v) => !v)} className="shrink-0 text-sm font-semibold text-accent-ink underline-offset-4 hover:underline">
              {showAll ? "Show featured" : `View all ${plans.length}`}
            </button>
          )}
        </div>

        <motion.ul
          ref={listRef}
          layout={!reduce}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {exact.map((plan) => (
              <motion.li
                key={plan.id}
                layout={!reduce}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="flex w-[82%] shrink-0 snap-start sm:w-auto"
              >
                <PlanCard plan={plan} source={active ? "plan_finder" : "featured"} className="w-full" sizes={cardSizes} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {exact.length > 1 && <p className="mt-3 text-xs text-stone sm:hidden">Swipe to see all {exact.length} plans →</p>}

        {close.length > 0 && (
          <div className={exact.length ? "mt-10" : ""}>
            {exact.length > 0 && <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-stone uppercase">Close matches</p>}
            <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0">
              {close.map(({ plan, differences }) => (
                <li key={plan.id} className="flex w-[82%] shrink-0 snap-start sm:w-auto">
                  <PlanCard
                    plan={plan}
                    source="plan_finder_close"
                    note={differences.length ? `Close match · ${differences.join(" · ")}` : undefined}
                    className="w-full"
                    sizes={cardSizes}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[15px] leading-relaxed text-stone">
            Don&apos;t see the perfect fit? Every plan can be personalized — talk with our team about layout, size and finishes.
          </p>
          <button
            type="button"
            className="btn btn-outline-dark shrink-0"
            onClick={() => {
              trackEventOnce("consultation_started", { source: "plan_finder_cta" });
              startConsultation({ source: "plan_finder_cta" });
            }}
          >
            Talk With Our Team <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile / tablet bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-charcoal/60" onClick={() => setSheetOpen(false)} aria-hidden="true" />
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="finder-sheet-heading"
              className="relative mx-auto flex max-h-[88svh] w-full max-w-2xl flex-col rounded-t-xl bg-cream"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h3 id="finder-sheet-heading" className="font-serif text-xl">
                  Help Me Find My Home
                </h3>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Close plan finder"
                >
                  <Close size={22} />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain px-5 py-6">
                <Controls full={full} update={update} idPrefix="finder-mobile" />
              </div>
              <div className="flex gap-3 border-t border-line px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button type="button" onClick={reset} disabled={!active} className={cn("btn btn-outline-dark !px-4", !active && "opacity-40")}>
                  Reset
                </button>
                <button
                  type="button"
                  data-autofocus
                  className="btn btn-primary flex-1"
                  onClick={() => {
                    setSheetOpen(false);
                    window.setTimeout(scrollToResults, 50);
                  }}
                >
                  {active === 0 ? "Show plans" : exact.length ? `Show ${exact.length} matching ${exact.length === 1 ? "plan" : "plans"}` : "Show closest plans"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
