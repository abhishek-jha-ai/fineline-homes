"use client";

import Image from "next/image";
import { formatBaths, formatSqft, type HomePlan } from "@/data/plans";
import { useSite } from "./SiteProvider";
import { ArrowRight, Area, Bath, Bed } from "./icons";
import { cn } from "@/lib/cn";

interface PlanCardProps {
  plan: HomePlan;
  source: string;
  note?: string;
  className?: string;
  sizes?: string;
}

export function PlanCard({ plan, source, note, className, sizes = "(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 45vw, 82vw" }: PlanCardProps) {
  const { viewPlan } = useSite();

  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-sm border border-line bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgb(33_31_29/0.45)]", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={plan.image}
          alt={plan.imageAlt}
          fill
          sizes={sizes}
          placeholder="blur"
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-sm bg-charcoal/80 px-2 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
          {plan.stories === 1 ? "One-Story" : "Two-Story"} · {plan.style}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl">{plan.name}</h3>
        <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-stone">
          <div className="flex items-center gap-1.5">
            <Bed size={16} className="text-charcoal" />
            <dt className="sr-only">Bedrooms</dt>
            <dd>{plan.beds} Beds</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={16} className="text-charcoal" />
            <dt className="sr-only">Bathrooms</dt>
            <dd>{formatBaths(plan.baths)} Baths</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Area size={16} className="text-charcoal" />
            <dt className="sr-only">Approximate square feet</dt>
            <dd>~{formatSqft(plan.sqft)} Sq Ft</dd>
          </div>
        </dl>
        {note && <p className="mt-3 text-xs font-medium text-accent-ink">{note}</p>}
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => viewPlan(plan.id, source)}
            className="btn btn-outline-dark !min-h-11 !px-4 text-sm after:absolute after:inset-0 after:content-['']"
            aria-label={`View plan: ${plan.name}`}
          >
            View Plan <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
