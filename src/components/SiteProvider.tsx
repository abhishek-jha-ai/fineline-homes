"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { RegionId } from "@/data/regions";
import { plans, type HomePlan } from "@/data/plans";
import { trackEvent } from "@/lib/analytics";

interface SiteState {
  region: RegionId | null;
  selectRegion: (id: RegionId | null, source: string) => void;

  /** Plan detail dialog */
  openPlan: HomePlan | null;
  viewPlan: (id: string, source: string) => void;
  closePlan: () => void;

  /** Plan the visitor asked about — prefills the consultation wizard. */
  interestedPlanId: string | null;
  setInterestedPlanId: (id: string | null) => void;
  startConsultation: (opts?: { planId?: string | null; source?: string }) => void;
}

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<RegionId | null>(null);
  const [openPlan, setOpenPlan] = useState<HomePlan | null>(null);
  const [interestedPlanId, setInterestedPlanId] = useState<string | null>(null);

  const selectRegion = useCallback((id: RegionId | null, source: string) => {
    setRegion(id);
    if (id) trackEvent("region_selected", { region: id, source });
  }, []);

  const viewPlan = useCallback((id: string, source: string) => {
    const plan = plans.find((p) => p.id === id) ?? null;
    setOpenPlan(plan);
    if (plan) trackEvent("plan_viewed", { plan_id: plan.id, plan_name: plan.name, source });
  }, []);

  const closePlan = useCallback(() => setOpenPlan(null), []);

  const startConsultation = useCallback((opts?: { planId?: string | null; source?: string }) => {
    if (opts?.planId !== undefined) setInterestedPlanId(opts.planId);
    setOpenPlan(null);
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Move focus into the form for keyboard / screen reader users
      window.setTimeout(() => {
        el.querySelector<HTMLElement>("[data-wizard-focus]")?.focus({ preventScroll: true });
      }, 600);
    }
  }, []);

  const value = useMemo(
    () => ({ region, selectRegion, openPlan, viewPlan, closePlan, interestedPlanId, setInterestedPlanId, startConsultation }),
    [region, selectRegion, openPlan, viewPlan, closePlan, interestedPlanId, startConsultation],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
