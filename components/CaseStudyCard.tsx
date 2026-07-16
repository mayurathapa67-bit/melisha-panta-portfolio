import Link from "next/link";
import type { CaseStudy } from "@/lib/types";
import ResultsChart from "./ResultsChart";

const CATEGORY_STYLES: Record<string, string> = {
  SEO: "bg-teal/10 text-teal",
  PPC: "bg-purple/10 text-purple",
  Social: "bg-teal/10 text-teal",
  Content: "bg-purple/10 text-purple",
  Email: "bg-teal/10 text-teal",
};

export default function CaseStudyCard({
  study,
}: {
  study: CaseStudy;
}) {
  const chartData = Array.isArray(study.chart_data) ? study.chart_data : [];
  const categoryClass =
    CATEGORY_STYLES[study.category] ?? "bg-charcoal/10 text-charcoal";

  return (
    <Link
      href={`/portfolio/${study.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative h-44 overflow-hidden bg-gradient-brand">
        <div className="absolute inset-0 opacity-90 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${categoryClass} bg-white/90`}
        >
          {study.category}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/80">
            {study.industry}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-white">
            {study.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {study.executive_summary || study.challenge}
        </p>

        <div className="mt-4 h-24">
          <ResultsChart data={chartData} variant="area" height={96} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-charcoal/10 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">
              Traffic
            </p>
            <p className="font-display text-base font-semibold text-charcoal">
              {study.results.traffic_growth}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">
              Conv.
            </p>
            <p className="font-display text-base font-semibold text-charcoal">
              {study.results.conversion_rate}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">
              ROI
            </p>
            <p className="font-display text-base font-semibold text-charcoal">
              {study.results.roi}
            </p>
          </div>
        </div>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal transition-transform group-hover:gap-2">
          View case study →
        </span>
      </div>
    </Link>
  );
}
