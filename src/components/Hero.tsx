"use client";

import Image from "next/image";
import { images } from "@/data/images";
import { useSite } from "./SiteProvider";
import { TrustBar } from "./TrustBar";
import { ConceptBadge } from "./ConceptBadge";
import { ArrowRight } from "./icons";
import { trackEventOnce } from "@/lib/analytics";

export function Hero() {
  const { startConsultation } = useSite();

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-charcoal text-white">
      <Image
        src={images.heroSunsetEstate}
        alt="Newly built stone and board-and-batten home with glowing windows at sunset"
        fill
        preload
        fetchPriority="high"
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[72%_50%] lg:object-[60%_50%]"
      />
      {/* Legibility overlays: left-weighted on desktop, bottom-weighted on mobile */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/70 via-charcoal/35 to-charcoal/90 lg:hidden" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-charcoal/85 via-charcoal/45 to-charcoal/0 lg:block" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 hidden h-48 bg-gradient-to-t from-charcoal/80 to-transparent lg:block" />

      <div className="container-site flex flex-1 flex-col justify-end pt-32 pb-10 sm:justify-center sm:pt-36 lg:pt-40 lg:pb-16">
        <div className="max-w-[46rem]">
          <p className="eyebrow mb-5 text-white/90">Custom Homes. Lasting Value.</p>
          <h1 id="hero-heading" className="font-serif text-[2.15rem] leading-[1.12] tracking-[-0.01em] min-[400px]:text-[2.35rem] sm:text-[3.25rem] lg:text-[3.6rem] xl:text-[3.9rem]">
            <span className="block">Your Dream Home</span> <span className="block">Built the Right Way</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-white/90 sm:text-lg">
            We build beautiful, high-quality new homes in Pennsylvania, Southern New York, and the Triad region of North Carolina.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="#plans" className="btn btn-primary">
              Explore Home Plans <ArrowRight size={16} />
            </a>
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => {
                trackEventOnce("consultation_started", { source: "hero" });
                startConsultation({ source: "hero" });
              }}
            >
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>

      <ConceptBadge className="absolute top-[84px] right-5 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-white/75 backdrop-blur-sm sm:right-8 lg:top-[108px] lg:right-10 xl:right-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]" />
      <TrustBar />
    </section>
  );
}
