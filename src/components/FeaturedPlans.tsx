import { PLANS_ARE_SAMPLE } from "@/data/plans";
import { PlanFinder } from "./PlanFinder";
import { Reveal } from "./Reveal";

export function FeaturedPlans() {
  return (
    <section id="plans" aria-labelledby="plans-heading" className="bg-cream py-20 sm:py-24 lg:py-28">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent-ink">Featured Home Plans</p>
          <h2 id="plans-heading" className="mt-3 font-serif text-[2rem] leading-tight sm:text-[2.6rem]">
            Find a Plan That Fits Your Lifestyle
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">
            Every plan is a starting point. Tell us how you want to live and we&apos;ll match you with layouts to personalize with the Fine Line Homes team.
          </p>
        </Reveal>

        <PlanFinder />

        {PLANS_ARE_SAMPLE && (
          <p className="mt-8 text-xs leading-relaxed text-stone">
            Plans shown are sample concepts for this website preview. Final plans, specifications and availability will reflect Fine Line Homes&apos; current
            offerings.
          </p>
        )}
      </div>
    </section>
  );
}
