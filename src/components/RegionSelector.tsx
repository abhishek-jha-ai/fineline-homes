"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getRegion, regions } from "@/data/regions";
import { plans } from "@/data/plans";
import { useSite } from "./SiteProvider";
import { trackEventOnce } from "@/lib/analytics";
import { ArrowRight, Check, MapPin } from "./icons";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

export function RegionSelector() {
  const { region, selectRegion, startConsultation } = useSite();
  const active = getRegion(region);
  const planCount = active ? plans.filter((p) => p.regions.includes(active.id)).length : plans.length;

  return (
    <section id="regions" aria-labelledby="regions-heading" className="bg-charcoal py-20 text-white sm:py-24 lg:py-28">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent-soft">Where We Build</p>
          <h2 id="regions-heading" className="mt-3 font-serif text-[2rem] leading-tight sm:text-[2.6rem]">
            Where are you looking to build?
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-white/75">
            Fine Line Homes builds new homes across three regions. Choose yours to tailor plans and your consultation.
          </p>
        </Reveal>

        <div role="radiogroup" aria-label="Choose your region" className="mt-10 grid gap-4 md:grid-cols-3">
          {regions.map((r) => {
            const selected = region === r.id;
            return (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => selectRegion(selected ? null : r.id, "region_selector")}
                className={cn(
                  "group relative isolate flex min-h-[150px] items-end overflow-hidden rounded-sm p-5 text-left ring-1 transition-[box-shadow,transform] duration-300 md:min-h-[240px]",
                  selected ? "ring-2 ring-accent-soft" : "ring-white/15 hover:ring-white/40",
                )}
              >
                <Image
                  src={r.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  placeholder="blur"
                  className="-z-20 object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                />
                <span aria-hidden="true" className={cn("absolute inset-0 -z-10 transition-colors duration-300", selected ? "bg-charcoal/45" : "bg-charcoal/60 group-hover:bg-charcoal/50")} />
                <span className="flex w-full items-end justify-between gap-3">
                  <span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-white/80 uppercase">
                      <MapPin size={14} /> {r.abbr}
                    </span>
                    <span className="mt-1 block font-serif text-2xl">{r.name}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                      selected ? "border-accent bg-accent text-white" : "border-white/50 text-transparent",
                    )}
                  >
                    <Check size={16} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 min-h-[120px]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active?.id ?? "none"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6 rounded-sm border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="max-w-2xl">
                <p className="font-serif text-2xl">{active ? active.headline : "Serving Pennsylvania, Southern New York & the NC Triad"}</p>
                <p className="mt-2 leading-relaxed text-white/75">
                  {active
                    ? active.blurb
                    : "Select a region above and we'll tailor the plan finder and your consultation request to where you want to build."}
                </p>
                {active && active.offices.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm text-white/75">
                    {active.offices.map((o) => (
                      <li key={o.name}>
                        <span className="font-semibold text-white">{o.name}</span>
                        {o.address ? ` · ${o.address}` : ""}
                        {o.phone ? ` · ${o.phone}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                {active && active.communities.length > 0 && (
                  <p className="mt-3 text-sm text-white/75">Communities: {active.communities.map((c) => c.name).join(", ")}</p>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <a href="#plans" className="btn btn-outline-light">
                  {active ? `View ${planCount} Plans` : "Browse Plans"}
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    trackEventOnce("consultation_started", { source: "region_selector", region: active?.id ?? null });
                    startConsultation({ source: "region_selector" });
                  }}
                >
                  {active ? `Consult in ${active.shortName}` : "Schedule a Consultation"} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
