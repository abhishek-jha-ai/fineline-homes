import Image from "next/image";
import { images } from "@/data/images";
import { siteConfig } from "@/config/site";
import { ConsultationWizard } from "./ConsultationWizard";
import { PhoneLink } from "./PhoneLink";
import { Calendar, Check, MapPin } from "./icons";

const points = [
  "Talk through your location, land and timeline",
  "Get help narrowing down the right home plan",
  "Learn how plans can be personalized",
];

export function ConsultationSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-hidden bg-charcoal py-20 text-white sm:py-24 lg:py-28">
      <Image src={images.livingOpenConcept} alt="" fill sizes="100vw" placeholder="blur" className="-z-20 object-cover opacity-30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-charcoal via-charcoal/90 to-charcoal/70" />

      <div className="container-site grid gap-12 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-16">
        <div className="lg:pt-6">
          <p className="eyebrow text-accent-soft">Let&apos;s Build Your Dream Home</p>
          <h2 id="contact-heading" className="mt-3 font-serif text-[2.25rem] leading-tight sm:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-white/80">
            Talk with our team about your ideas, timeline and land. We&apos;ll help you find the right plan and make it your own.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-white/90">
                <Check size={20} className="mt-0.5 shrink-0 text-accent-soft" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 grid gap-4 border-t border-white/15 pt-8 text-sm text-white/75 sm:grid-cols-2">
            <p className="flex items-start gap-3">
              <MapPin size={20} className="shrink-0 text-accent-soft" />
              Pennsylvania · Southern New York · North Carolina Triad
            </p>
            <p className="flex items-start gap-3">
              <Calendar size={20} className="shrink-0 text-accent-soft" />
              Takes about a minute — no obligation
            </p>
            {siteConfig.contact.phone && <PhoneLink source="contact_section" className="text-white" />}
          </div>
        </div>

        <ConsultationWizard />
      </div>
    </section>
  );
}
