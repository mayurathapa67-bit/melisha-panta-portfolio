"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const safe = Array.isArray(testimonials) ? testimonials : [];
  const [index, setIndex] = useState(0);

  if (safe.length === 0) {
    return null;
  }

  const current = safe[index];
  const next = () => setIndex((i) => (i + 1) % safe.length);
  const prev = () => setIndex((i) => (i - 1 + safe.length) % safe.length);

  return (
    <div className="relative mx-auto max-w-3xl rounded-3xl border border-charcoal/10 bg-card p-8 shadow-soft md:p-12">
      <span className="font-display text-6xl leading-none text-gradient">
        &ldquo;
      </span>
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={current.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="mt-2"
        >
          <p className="font-display text-xl leading-relaxed text-charcoal md:text-2xl">
            {current.quote}
          </p>
            <footer className="mt-6 flex items-center gap-4">
              <div className="relative h-12 w-12 flex-none overflow-hidden rounded-full bg-gradient-brand text-lg font-semibold text-white">
                {current.avatar ? (
                  <Image
                    src={current.avatar}
                    alt={current.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    {current.name.charAt(0)}
                  </span>
                )}
              </div>
            <div>
              <p className="font-semibold text-charcoal">{current.name}</p>
              <p className="text-sm text-muted">
                {current.role}, {current.company}
              </p>
            </div>
          </footer>
        </motion.blockquote>
      </AnimatePresence>

      {safe.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:bg-charcoal hover:text-cream"
          >
            ←
          </button>
          <div className="flex gap-1.5">
            {safe.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-gradient-brand" : "bg-charcoal/20"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:bg-charcoal hover:text-cream"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
