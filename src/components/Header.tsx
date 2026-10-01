"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, siteConfig, telHref } from "@/config/site";
import { useSite } from "./SiteProvider";
import { Logo } from "./Logo";
import { ArrowRight, Close, Menu, Phone } from "./icons";
import { trackEvent, trackEventOnce } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function Header() {
  const { startConsultation } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const consult = (source: string) => {
    setOpen(false);
    trackEventOnce("consultation_started", { source });
    startConsultation({ source });
  };

  const phone = siteConfig.contact.phone;

  const compact = scrolled && !open;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 text-white transition-[background-color,box-shadow,padding] duration-300",
        scrolled || open ? "bg-charcoal/95 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className={cn("container-site flex items-center justify-between gap-6 transition-[height] duration-300", compact ? "h-16 lg:h-[72px]" : "h-[72px] lg:h-24")}>
        <a href="#top" className="shrink-0" aria-label="Fine Line Homes — back to top" onClick={() => setOpen(false)}>
          <Logo compact={compact} />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative py-2 text-[15px] font-medium text-white/90 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent-soft after:transition-transform hover:text-white hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {phone && (
            <a
              href={telHref(phone)}
              onClick={() => trackEvent("phone_clicked", { source: "header" })}
              className="hidden items-center gap-2 px-3 text-sm font-medium text-white/90 hover:text-white xl:inline-flex"
            >
              <Phone size={16} /> {phone}
            </a>
          )}
          <button type="button" onClick={() => consult("header")} className="btn btn-primary hidden !min-h-11 sm:inline-flex">
            Schedule a Consultation <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 overflow-y-auto bg-charcoal pt-[72px] text-white lg:hidden"
          >
            <nav aria-label="Mobile" className="container-site flex min-h-full flex-col pt-6 pb-10">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.25 }}
                  >
                    <a href={link.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 font-serif text-2xl">
                      {link.label}
                      <ArrowRight size={18} className="text-accent-soft" />
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3 pt-10">
                <button type="button" onClick={() => consult("mobile_menu")} className="btn btn-primary w-full">
                  Schedule a Consultation <ArrowRight size={16} />
                </button>
                {phone && (
                  <a
                    href={telHref(phone)}
                    onClick={() => trackEvent("phone_clicked", { source: "mobile_menu" })}
                    className="btn btn-outline-light w-full"
                  >
                    <Phone size={16} /> Call {phone}
                  </a>
                )}
                <p className="pt-2 text-center text-sm text-white/60">Serving Pennsylvania, Southern New York &amp; the NC Triad</p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
