"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSite } from "./SiteProvider";
import { trackEventOnce } from "@/lib/analytics";
import { ArrowRight } from "./icons";

/**
 * Compact bottom bar on phones. Appears once the visitor scrolls past the hero
 * and hides while the consultation form itself is on screen.
 */
export function MobileStickyCTA() {
  const { startConsultation, openPlan } = useSite();
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contact");
    let io: IntersectionObserver | undefined;
    if (contact) {
      io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.15 });
      io.observe(contact);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastHero && !formVisible && !openPlan;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-charcoal/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
          <div className="grid grid-cols-[1fr_1.35fr] gap-2">
            <a href="#plans" className="btn btn-outline-light !min-h-12 !px-3 text-sm">
              Explore Plans
            </a>
            <button
              type="button"
              className="btn btn-primary !min-h-12 !px-3 text-sm"
              onClick={() => {
                trackEventOnce("consultation_started", { source: "mobile_sticky" });
                startConsultation({ source: "mobile_sticky" });
              }}
            >
              Schedule Consultation <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
