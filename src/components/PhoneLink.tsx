"use client";

import { siteConfig, telHref } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { Phone } from "./icons";
import { cn } from "@/lib/cn";

/** Renders only when a phone number is configured in src/config/site.ts. */
export function PhoneLink({ source, className, label }: { source: string; className?: string; label?: string }) {
  const phone = siteConfig.contact.phone;
  if (!phone) return null;
  return (
    <a href={telHref(phone)} onClick={() => trackEvent("phone_clicked", { source })} className={cn("inline-flex items-center gap-2 font-semibold", className)}>
      <Phone size={18} /> {label ?? phone}
    </a>
  );
}
