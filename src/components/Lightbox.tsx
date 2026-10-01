"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { GalleryItem } from "@/data/gallery";
import { useDialog } from "@/lib/useDialog";
import { ChevronLeft, ChevronRight, Close } from "./icons";

interface LightboxProps {
  items: GalleryItem[];
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
}

export function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const open = index !== null;
  const ref = useDialog<HTMLDivElement>(open, onClose);
  const item = open ? items[index] : null;

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    onChange((index + dir + items.length) % items.length);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Project photo viewer"
          className="fixed inset-0 z-50 flex flex-col bg-[#121110] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm text-white/70 tabular-nums" aria-live="polite">
              {index! + 1} / {items.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Close photo viewer"
            >
              <Close size={24} />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={item.id}
                className="absolute inset-0 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Image src={item.image} alt={item.alt} fill sizes="100vw" placeholder="blur" className="pointer-events-none object-contain select-none" draggable={false} />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 backdrop-blur hover:bg-black/60 sm:inline-flex"
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 backdrop-blur hover:bg-black/60 sm:inline-flex"
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <p className="text-sm sm:text-base">{item.caption}</p>
            <div className="flex gap-2 sm:hidden">
              <button type="button" onClick={() => go(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10" aria-label="Previous photo">
                <ChevronLeft size={22} />
              </button>
              <button type="button" onClick={() => go(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10" aria-label="Next photo">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
