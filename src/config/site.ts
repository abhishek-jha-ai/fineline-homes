/**
 * Central site configuration.
 *
 * Everything a real launch needs to change (domain, contact details,
 * the concept badge) lives here so it can be updated in one place.
 */

function resolveSiteUrl(): string {
  // 1. Explicit override (custom domain, staging, etc.)
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // 2. Vercel production alias, provided automatically at build time on Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  // 3. Local development
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Fine Line Homes",
  url: resolveSiteUrl(),
  title: "Fine Line Homes | New Home Builder in PA, Southern NY & the NC Triad",
  shortTitle: "Fine Line Homes",
  description:
    "Fine Line Homes builds beautiful, high-quality new homes in Pennsylvania, Southern New York, and the Triad region of North Carolina. Explore customizable home plans and schedule a consultation.",
  tagline: "Your Dream Home, Built the Right Way",
  ogImage: "/og-fine-line.jpg",
  brandYears: "50+",

  /**
   * Contact channels. Leave a value as `null` to hide it everywhere on the
   * site — nothing renders until a verified number / address is supplied.
   */
  contact: {
    phone: null as string | null, // e.g. "(555) 555-0123"
    email: null as string | null, // e.g. "info@example.com"
  },

  social: {
    instagram: null as string | null,
    facebook: null as string | null,
  },

  /**
   * Keep the concept preview out of search engines. Link previews (Open Graph)
   * still work. Flip to true at launch on the real domain.
   */
  allowIndexing: false,

  /** Small "Website Concept" badge. Set to false to remove it everywhere. */
  showConceptBadge: true,
  conceptBadgeText: "Website Concept for Fine Line Homes",
} as const;

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Home Plans", href: "#plans" },
  { label: "Our Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
