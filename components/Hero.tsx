"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { HeroData } from "@/lib/types";
import AnimatedCounter from "./AnimatedCounter";

const FALLBACK_HERO: HeroData = {
  title: "Melisha Panta",
  role: "Digital Marketing Specialist",
  subtitle: "Driving measurable growth through data-driven marketing strategies",
  stats: [
    { label: "Avg ROI", value: "500%" },
    { label: "Revenue Generated", value: "$10M+" },
    { label: "Campaigns", value: "100+" },
  ],
  cta_primary: "View Case Studies",
  cta_secondary: "Get Free Audit",
  image: "/images/hero-melisha.jpg",
};

const ctaHref = (label: string): string => {
  if (label.toLowerCase().includes("case")) return "/portfolio";
  if (label.toLowerCase().includes("audit")) return "/contact";
  return "/contact";
};

export default function Hero({ hero }: { hero?: HeroData }) {
  const data = hero ?? FALLBACK_HERO;
  const stats = Array.isArray(data.stats) ? data.stats : [];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-40 h-[28rem] w-[28rem] rounded-full bg-purple/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-teal"
          >
            {data.role}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-charcoal md:text-6xl lg:text-7xl"
          >
            Driving Growth Through{" "}
            <span className="text-gradient">Strategic Marketing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted"
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href={ctaHref(data.cta_primary)}
              className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02]"
            >
              {data.cta_primary}
            </Link>
            <Link
              href={ctaHref(data.cta_secondary)}
              className="rounded-full border border-charcoal/20 px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-cream"
            >
              {data.cta_secondary}
            </Link>
          </motion.div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              >
                <AnimatedCounter
                  value={stat.value}
                  className="block font-display text-3xl font-semibold text-charcoal md:text-4xl"
                />
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-charcoal/10 bg-gradient-brand shadow-soft">
            {data.image ? (
              <Image
                src={data.image}
                alt={data.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]">
                <span className="font-display text-7xl font-semibold text-white/90">
                  MP
                </span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-charcoal/10 bg-card px-5 py-4 shadow-soft sm:block">
            <p className="font-display text-2xl font-semibold text-gradient">
              10M+
            </p>
            <p className="text-xs uppercase tracking-wide text-muted">
              Revenue Driven
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
