import type { HomePlan, PlanStyle } from "@/data/plans";
import type { RegionId } from "@/data/regions";

export type SizeRange = "any" | "under-2000" | "2000-2500" | "2500-3000" | "3000-plus";
export type StoriesPref = "any" | "1" | "2";

export interface PlanCriteria {
  region: RegionId | "any";
  beds: "any" | "2" | "3" | "4" | "5";
  baths: "any" | "2" | "2.5" | "3" | "3.5";
  size: SizeRange;
  stories: StoriesPref;
  style: PlanStyle | "any";
}

export const defaultCriteria: PlanCriteria = {
  region: "any",
  beds: "any",
  baths: "any",
  size: "any",
  stories: "any",
  style: "any",
};

export const sizeRanges: Record<Exclude<SizeRange, "any">, [number, number]> = {
  "under-2000": [0, 1999],
  "2000-2500": [2000, 2500],
  "2500-3000": [2501, 3000],
  "3000-plus": [3001, Infinity],
};

export interface PlanMatch {
  plan: HomePlan;
  exact: boolean;
  score: number;
  /** Human-readable reasons a close match differs from the criteria. */
  differences: string[];
}

/**
 * Scores each plan against the criteria. Beds/baths are treated as minimums
 * ("3+ beds"). Plans that miss on one or two soft criteria are still returned
 * as close matches so a buyer never hits a dead end.
 */
export function matchPlans(plans: HomePlan[], c: PlanCriteria): PlanMatch[] {
  return plans
    .map((plan) => {
      let score = 0;
      let misses = 0;
      const differences: string[] = [];

      if (c.region !== "any") {
        if (plan.regions.includes(c.region)) score += 3;
        else {
          misses += 2;
          differences.push("Ask about your region");
        }
      }
      if (c.beds !== "any") {
        const want = Number(c.beds);
        if (plan.beds >= want) score += plan.beds === want ? 3 : 2;
        else {
          misses += want - plan.beds;
          differences.push(`${plan.beds} beds`);
        }
      }
      if (c.baths !== "any") {
        const want = Number(c.baths);
        if (plan.baths >= want) score += 2;
        else {
          misses += 1;
          differences.push(`${plan.baths} baths`);
        }
      }
      if (c.size !== "any") {
        const [min, max] = sizeRanges[c.size];
        if (plan.sqft >= min && plan.sqft <= max) score += 3;
        else {
          const distance = plan.sqft < min ? min - plan.sqft : plan.sqft - max;
          misses += distance <= 300 ? 1 : 2;
          differences.push(plan.sqft < min ? "A bit smaller" : "A bit larger");
        }
      }
      if (c.stories !== "any") {
        if (String(plan.stories) === c.stories) score += 2;
        else {
          misses += 1;
          differences.push(plan.stories === 1 ? "One-story" : "Two-story");
        }
      }
      if (c.style !== "any") {
        if (plan.style === c.style) score += 2;
        else {
          misses += 1;
          differences.push(plan.style);
        }
      }

      return { plan, exact: misses === 0, score: score - misses * 2, differences };
    })
    .sort((a, b) => Number(b.exact) - Number(a.exact) || b.score - a.score || Number(b.plan.featured) - Number(a.plan.featured));
}

export function activeCriteriaCount(c: PlanCriteria) {
  return Object.values(c).filter((v) => v !== "any").length;
}
