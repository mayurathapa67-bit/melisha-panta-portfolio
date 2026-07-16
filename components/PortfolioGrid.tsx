"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CaseStudy, Category } from "@/lib/types";
import CaseStudyCard from "@/components/CaseStudyCard";

const FILTERS: ("All" | Category)[] = [
  "All",
  "SEO",
  "PPC",
  "Social",
  "Content",
  "Email",
];

export default function PortfolioGrid({ studies }: { studies: CaseStudy[] }) {
  const safe = useMemo(
    () => (Array.isArray(studies) ? studies : []),
    [studies]
  );
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return safe.filter((s) => {
      const matchesFilter = filter === "All" || s.category === filter;
      const matchesQuery =
        q === "" ||
        s.title.toLowerCase().includes(q) ||
        s.client.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [safe, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-gradient-brand text-white"
                  : "border border-charcoal/15 text-charcoal hover:bg-charcoal/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search case studies…"
          className="w-full rounded-full border border-charcoal/15 bg-card px-5 py-2.5 text-sm text-charcoal outline-none focus:border-teal md:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted">
          No case studies match your search.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-sm text-muted">
        Want results like these?{" "}
        <Link href="/contact" className="font-semibold text-teal hover:underline">
          Start a project →
        </Link>
      </p>
    </div>
  );
}
