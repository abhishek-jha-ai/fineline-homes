"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { formatBaths, formatSqft, PLANS_ARE_SAMPLE } from "@/data/plans";
import { regions } from "@/data/regions";
import { useSite } from "./SiteProvider";
import { useDialog } from "@/lib/useDialog";
import { trackEventOnce } from "@/lib/analytics";
import { ArrowRight, Area, Bath, Bed, Check, Close, Garage, Stories } from "./icons";

export function PlanDialog() {
  const { openPlan: plan, closePlan, startConsultation, region } = useSite();
  const ref = useDialog<HTMLDivElement>(!!plan, closePlan);

  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          key="plan-dialog"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" onClick={closePlan} aria-hidden="true" />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-dialog-title"
            className="relative flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-lg bg-cream shadow-2xl sm:rounded-sm"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={closePlan}
              className="absolute top-3 right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/70 text-white backdrop-blur hover:bg-charcoal"
              aria-label="Close plan details"
            >
              <Close size={20} />
            </button>

            <div className="overflow-y-auto overscroll-contain">
              <div className="grid md:grid-cols-[1.1fr_1fr]">
                <div className="relative aspect-[4/3] bg-sand md:aspect-auto md:min-h-full">
                  <Image src={plan.image} alt={plan.imageAlt} fill sizes="(min-width: 768px) 480px, 100vw" placeholder="blur" className="object-cover" />
                </div>

                <div className="p-6 sm:p-8">
                  <p className="eyebrow text-accent-ink">
                    {plan.stories === 1 ? "One-Story" : "Two-Story"} · {plan.style}
                  </p>
                  <h2 id="plan-dialog-title" className="mt-2 font-serif text-3xl">
                    {plan.name}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone">{plan.summary}</p>

                  <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-line bg-line text-center">
                    {[
                      { icon: Bed, label: "Beds", value: plan.beds },
                      { icon: Bath, label: "Baths", value: formatBaths(plan.baths) },
                      { icon: Area, label: "Approx. Sq Ft", value: formatSqft(plan.sqft) },
                      { icon: Stories, label: "Stories", value: plan.stories },
                      { icon: Garage, label: "Garage", value: `${plan.garage}-car` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex flex-col items-center bg-white px-2 py-3">
                        <Icon size={18} className="text-accent-ink" />
                        <dt className="order-last text-[11px] tracking-wide text-stone uppercase">{label}</dt>
                        <dd className="mt-1 font-serif text-lg">{value}</dd>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center bg-white px-2 py-3">
                      <dt className="order-last text-[11px] tracking-wide text-stone uppercase">Customizable</dt>
                      <dd className="font-serif text-lg">Yes</dd>
                    </div>
                  </dl>

                  <h3 className="mt-6 text-sm font-semibold">Plan highlights</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-[15px]">
                        <Check size={18} className="mt-0.5 shrink-0 text-accent-ink" /> {h}
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-6 text-sm font-semibold">Available to build in</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {regions
                      .filter((r) => plan.regions.includes(r.id))
                      .map((r) => (
                        <li
                          key={r.id}
                          className={`rounded-full border px-3 py-1 text-[13px] ${r.id === region ? "border-charcoal bg-charcoal text-cream" : "border-line bg-white"}`}
                        >
                          {r.shortName}
                        </li>
                      ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      data-autofocus
                      className="btn btn-primary w-full"
                      onClick={() => {
                        trackEventOnce("consultation_started", { source: "plan_dialog", plan_id: plan.id });
                        startConsultation({ planId: plan.id, source: "plan_dialog" });
                      }}
                    >
                      Ask About {plan.name} <ArrowRight size={16} />
                    </button>
                    <button type="button" onClick={closePlan} className="btn btn-outline-dark w-full">
                      Keep Browsing
                    </button>
                  </div>

                  {PLANS_ARE_SAMPLE && (
                    <p className="mt-5 text-xs leading-relaxed text-stone">
                      Sample plan for this website concept. Specifications are illustrative and will be replaced with Fine Line Homes&apos; actual plans.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
