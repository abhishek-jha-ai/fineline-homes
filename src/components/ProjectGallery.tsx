"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { galleryFilters, galleryItems, type GalleryCategory } from "@/data/gallery";
import { trackEvent } from "@/lib/analytics";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";
import { Expand } from "./icons";
import { cn } from "@/lib/cn";

export function ProjectGallery() {
  const [filter, setFilter] = useState<"all" | GalleryCategory>("all");
  const [index, setIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const items = filter === "all" ? galleryItems : galleryItems.filter((g) => g.category === filter);

  const open = (i: number) => {
    setIndex(i);
    trackEvent("gallery_viewed", { image_id: items[i].id, category: items[i].category, filter });
  };

  return (
    <section id="work" aria-labelledby="work-heading" className="bg-cream py-20 sm:py-24 lg:py-28">
      <div className="container-site">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent-ink">Our Work</p>
            <h2 id="work-heading" className="mt-3 font-serif text-[2rem] leading-tight sm:text-[2.6rem]">
              Crafted Inside and Out
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">
              Exteriors, kitchens, living spaces and the details in between — a look at the character and finish that go into a Fine Line home.
            </p>
          </div>
          <div role="group" aria-label="Filter gallery" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {galleryFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                aria-controls="gallery-grid"
                onClick={() => {
                  setFilter(f.id);
                  trackEvent("gallery_viewed", { action: "filter", filter: f.id });
                }}
                className="chip shrink-0"
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.ul id="gallery-grid" layout={!reduce} className="mt-10 grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 min-[480px]:auto-rows-[190px] sm:auto-rows-[230px] sm:gap-4 lg:auto-rows-[250px] lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, i) => (
              <motion.li
                key={item.id}
                layout={!reduce}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(item.span === "feature" && "col-span-2 row-span-2", item.span === "wide" && "col-span-2")}
              >
                <button
                  type="button"
                  onClick={() => open(i)}
                  className="group relative block h-full w-full overflow-hidden rounded-sm bg-sand"
                  aria-label={`Open image: ${item.caption}`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    placeholder="blur"
                    sizes={item.span ? "(min-width: 1280px) 860px, (min-width: 1024px) 66vw, 100vw" : "(min-width: 1280px) 420px, (min-width: 1024px) 33vw, 50vw"}
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-charcoal/80 to-transparent p-3 pt-10 text-left text-white opacity-100 transition-opacity duration-300 sm:p-4 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                    <span className="text-xs font-medium sm:text-sm">{item.caption}</span>
                    <Expand size={18} className="hidden shrink-0 sm:block" />
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <Lightbox items={items} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
