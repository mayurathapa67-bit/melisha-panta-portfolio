import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import ResultsChart from "@/components/ResultsChart";
import AnimatedCounter from "@/components/AnimatedCounter";
import CaseStudyCard from "@/components/CaseStudyCard";
import type { CaseStudy } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const study = Array.isArray(content.portfolio)
    ? content.portfolio.find((s) => s.slug === slug)
    : undefined;
  if (!study) {
    return { title: "Case Study Not Found" };
  }
  return {
    title: study.title,
    description: study.executive_summary || study.challenge,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const studies = Array.isArray(content.portfolio) ? content.portfolio : [];
  const study = studies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const metrics = Array.isArray(study.metrics) ? study.metrics : [];
  const related = studies
    .filter((s) => s.slug !== study.slug && s.category === study.category)
    .slice(0, 3);
  const fallbackRelated = related.length
    ? related
    : studies.filter((s) => s.slug !== study.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-5 py-14 md:py-20">
      <Link
        href="/portfolio"
        className="text-sm font-medium text-teal hover:underline"
      >
        ← All case studies
      </Link>

      <header className="mt-6">
        <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
          {study.category}
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-charcoal md:text-5xl">
          {study.title}
        </h1>
        <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted">
          {study.client} · {study.industry}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-charcoal">
          {study.executive_summary}
        </p>
      </header>

      <section className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-charcoal/10 bg-card p-5">
          <AnimatedCounter
            value={study.results.traffic_growth}
            className="block font-display text-3xl font-semibold text-gradient"
          />
          <p className="mt-1 text-xs uppercase tracking-wide text-muted">
            Traffic Growth
          </p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-card p-5">
          <AnimatedCounter
            value={study.results.conversion_rate}
            className="block font-display text-3xl font-semibold text-gradient"
          />
          <p className="mt-1 text-xs uppercase tracking-wide text-muted">
            Conversion Rate
          </p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-card p-5">
          <AnimatedCounter
            value={study.results.roi}
            className="block font-display text-3xl font-semibold text-gradient"
          />
          <p className="mt-1 text-xs uppercase tracking-wide text-muted">
            Return on Investment
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Growth over time
        </h2>
        <div className="mt-4 rounded-2xl border border-charcoal/10 bg-card p-5">
          <ResultsChart data={study.chart_data} variant="area" height={300} />
        </div>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            The Challenge
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{study.challenge}</p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            The Strategy
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{study.strategy}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Before &amp; After
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-charcoal/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal/5 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Metric</th>
                <th className="px-5 py-3 font-medium">Before</th>
                <th className="px-5 py-3 font-medium">After</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label} className="border-t border-charcoal/10">
                  <td className="px-5 py-3 font-medium text-charcoal">
                    {m.label}
                  </td>
                  <td className="px-5 py-3 text-muted">{m.before}</td>
                  <td className="px-5 py-3 font-semibold text-teal">
                    {m.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {study.testimonial && (
        <section className="mt-12 rounded-3xl border border-charcoal/10 bg-card p-8 shadow-soft">
          <span className="font-display text-5xl leading-none text-gradient">
            &ldquo;
          </span>
          <blockquote className="mt-2">
            <p className="font-display text-xl leading-relaxed text-charcoal">
              {study.testimonial.quote}
            </p>
            <footer className="mt-4 text-sm text-muted">
              <span className="font-semibold text-charcoal">
                {study.testimonial.name}
              </span>{" "}
              — {study.testimonial.role}, {study.testimonial.company}
            </footer>
          </blockquote>
        </section>
      )}

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Related case studies
          </h2>
          <Link
            href="/portfolio"
            className="text-sm font-semibold text-teal hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {fallbackRelated.map((r: CaseStudy) => (
            <CaseStudyCard key={r.slug} study={r} />
          ))}
        </div>
      </section>
    </article>
  );
}
