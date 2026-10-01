import type { RegionId } from "@/data/regions";

export interface ConsultationLead {
  region: RegionId | null;
  intent: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  size: string | null;
  name: string;
  email: string;
  phone: string;
  zip: string;
  message: string;
  /** Plan the visitor was viewing when they started, if any. */
  planId: string | null;
  /** Attribution captured from the landing URL (utm_*, fbclid, gclid). */
  attribution: Record<string, string>;
  submittedAt: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(lead: Pick<ConsultationLead, "name" | "email" | "phone" | "zip">) {
  const errors: ValidationErrors = {};
  if (lead.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(lead.email.trim())) errors.email = "Please enter a valid email address.";
  const digits = lead.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) errors.phone = "Please enter a 10-digit phone number.";
  if (!/^\d{5}(-\d{4})?$/.test(lead.zip.trim())) errors.zip = "Please enter a 5-digit ZIP code.";
  return errors;
}

export function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];

export function captureAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_KEYS) {
      const v = params.get(key);
      if (v) out[key] = v;
    }
    if (document.referrer) out.referrer = document.referrer;
  } catch {
    // ignore
  }
  return out;
}
