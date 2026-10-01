/**
 * Consultation form configuration.
 *
 * The wizard (components/ConsultationWizard.tsx) reads its options from here,
 * and submits to `endpoint`. The API route (app/api/consultation/route.ts)
 * forwards each lead to any destinations configured via environment variables:
 *
 *   CONSULTATION_WEBHOOK_URL   Generic JSON webhook — Zapier, Make, GoHighLevel
 *                              inbound webhook, n8n, a custom CRM endpoint, etc.
 *   HUBSPOT_PORTAL_ID          HubSpot Forms API (portal + form GUID)
 *   HUBSPOT_FORM_GUID
 *   GHL_WEBHOOK_URL            GoHighLevel inbound webhook (workflow trigger)
 *   LEAD_NOTIFY_WEBHOOK_URL    Optional second webhook for email/SMS alerts
 *                              (e.g. a Zapier zap that sends email + Twilio SMS)
 *
 * With nothing configured the route validates the lead and returns success,
 * which is what the concept demo uses.
 */

export const consultationConfig = {
  endpoint: "/api/consultation",

  /** Optional external scheduler (Calendly, Cal.com, GHL calendar…). Shown on the success screen when set. */
  schedulingUrl: null as string | null,

  intents: [
    { id: "browse-plans", label: "Browse home plans" },
    { id: "build-soon", label: "Build soon" },
    { id: "own-land", label: "Own land already" },
    { id: "help-choosing", label: "Need help choosing a plan" },
    { id: "exploring", label: "Just exploring" },
  ],

  bedrooms: ["2", "3", "4", "5+"],
  bathrooms: ["2", "2.5", "3", "3.5+"],
  sizes: [
    { id: "under-2000", label: "Under 2,000 sq ft" },
    { id: "2000-2500", label: "2,000 – 2,500 sq ft" },
    { id: "2500-3000", label: "2,500 – 3,000 sq ft" },
    { id: "3000-plus", label: "3,000+ sq ft" },
    { id: "unsure", label: "Not sure yet" },
  ],

  successMessage:
    "Thank you — your request is in. A member of the Fine Line Homes team will reach out to set up a time that works for you.",
} as const;

export type ConsultationIntent = (typeof consultationConfig.intents)[number]["id"];
