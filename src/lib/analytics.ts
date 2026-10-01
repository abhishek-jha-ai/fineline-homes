/**
 * Centralized analytics.
 *
 * Every tracked interaction on the site calls `trackEvent`. Events are fanned
 * out to whichever tools are present on the page — Google Tag Manager
 * (dataLayer), GA4 (gtag), Meta Pixel (fbq) and Vercel Analytics (va) — so
 * adding a provider later only requires adding its script tag.
 */

export type AnalyticsEvent =
  | "consultation_started"
  | "region_selected"
  | "plan_viewed"
  | "plan_filter_used"
  | "gallery_viewed"
  | "consultation_submitted"
  | "phone_clicked";

export type EventProps = Record<string, string | number | boolean | null | undefined>;

type AnyFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: AnyFn;
    fbq?: AnyFn;
    va?: AnyFn;
  }
}

/** Map site events to Meta standard events where one applies. */
const metaStandardEvents: Partial<Record<AnalyticsEvent, string>> = {
  consultation_submitted: "Lead",
  phone_clicked: "Contact",
  plan_viewed: "ViewContent",
};

const startedOnce = new Set<string>();

export function trackEvent(event: AnalyticsEvent, props: EventProps = {}) {
  if (typeof window === "undefined") return;

  const payload = { ...props, page: window.location.pathname };

  try {
    window.dataLayer?.push({ event, ...payload });
    window.gtag?.("event", event, payload);
    const meta = metaStandardEvents[event];
    if (window.fbq) {
      if (meta) window.fbq("track", meta, payload);
      else window.fbq("trackCustom", event, payload);
    }
    window.va?.("event", { name: event, data: payload });
  } catch {
    // Analytics must never break the UI.
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, payload);
  }
}

/** Fire an event at most once per page view (e.g. consultation_started). */
export function trackEventOnce(event: AnalyticsEvent, props: EventProps = {}) {
  if (startedOnce.has(event)) return;
  startedOnce.add(event);
  trackEvent(event, props);
}
