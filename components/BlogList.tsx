"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const safe = useMemo(
    () => (Array.isArray(posts) ? posts : []),
    [posts]
  );
  const categories = useMemo(() => {
    const set = new Set<string>();
    safe.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [safe]);
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () =>
      filter === "All" ? safe : safe.filter((p) => p.category === filter),
    [safe, filter]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === c
                ? "bg-gradient-brand text-white"
                : "border border-charcoal/15 text-charcoal hover:bg-charcoal/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="h-40 bg-gradient-brand">
              <div className="flex h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-teal/10 px-2.5 py-1 font-semibold text-teal">
                  {post.category}
                </span>
                <span>{post.read_time}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-charcoal group-hover:text-teal">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                {post.excerpt}
              </p>
              <span className="mt-4 text-sm font-medium text-teal">
                Read article →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
