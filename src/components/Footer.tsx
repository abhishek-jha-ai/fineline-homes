import { navLinks, siteConfig } from "@/config/site";
import { regions } from "@/data/regions";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";
import { ConceptBadge } from "./ConceptBadge";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#1a1816] pt-16 pb-28 text-white/75 md:pb-10">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="text-white" />
            <p className="mt-6 max-w-sm leading-relaxed">
              New home construction and customizable home plans in Pennsylvania, Southern New York and the Triad region of North Carolina.
            </p>
            <div className="mt-5 space-y-2">
              <PhoneLink source="footer" className="text-white" />
              {siteConfig.contact.email && (
                <a href={`mailto:${siteConfig.contact.email}`} className="block font-semibold text-white">
                  {siteConfig.contact.email}
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="text-sm font-semibold tracking-[0.14em] text-white uppercase">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold tracking-[0.14em] text-white uppercase">Where We Build</p>
            <ul className="mt-4 space-y-2.5">
              {regions.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
            <a href="#contact" className="btn btn-primary mt-6 !min-h-11 text-sm">
              Schedule a Consultation
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <ConceptBadge />
        </div>
      </div>
    </footer>
  );
}
