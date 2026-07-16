"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  durationMs?: number;
  className?: string;
}

function parseValue(value: string): {
  prefix: string;
  suffix: string;
  number: number;
} {
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!match) {
    return { prefix: "", suffix: value, number: 0 };
  }
  const number = parseFloat(match[2].replace(/,/g, ""));
  return {
    prefix: match[1] ?? "",
    suffix: match[3] ?? "",
    number: Number.isFinite(number) ? number : 0,
  };
}

export default function AnimatedCounter({
  value,
  durationMs = 1600,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const { prefix, suffix, number } = parseValue(value);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(number * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(number);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, number, durationMs]);

  const formatted = number >= 1000 ? Math.round(display).toLocaleString() : Math.round(display);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
