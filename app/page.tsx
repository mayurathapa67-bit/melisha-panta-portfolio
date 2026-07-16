import Link from "next/link";
import { getContent } from "@/lib/content";
import Hero from "@/components/Hero";
import CaseStudyCard from "@/components/CaseStudyCard";
import ServicesGrid from "@/components/ServicesGrid";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Home",
  description:
    "Melisha Panta — Digital Marketing Specialist driving measurable growth through data-driven SEO, PPC, social, content, and email marketing.",
};

const SERVICE_PREVIEW = ["SEO", "PPC", "Social", "Content", "Email"];

export default async function HomePage() {
  const content = await getContent();
  const featured = Array.isArray(content.portfolio)
    ? content.portfolio.slice(0, 3)
    : [];
  const previewServices = Array.isArray(content.services)
    ? content.services.filter((s) => SERVICE_PREVIEW.includes(s.title))
    : [];

  return (
    <div>
      <Hero hero={content.hero} />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured Work"
            title="Case studies with measurable impact"
            description="A selection of campaigns where strategy met the numbers."
          />
          <Link
            href="/portfolio"
            className="text-sm font-semibold text-teal hover:underline"
          >
            View all case studies →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </section>

      <section className="border-y border-charcoal/10 bg-card/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="What I Do"
              title="Services built around outcomes"
            />
            <Link
              href="/services"
              className="text-sm font-semibold text-teal hover:underline"
            >
              See all services →
            </Link>
          </div>
          <div className="mt-10">
            <ServicesGrid services={previewServices} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="Client Voices"
          title="Trusted by founders & marketing leaders"
          align="center"
        />
        <div className="mt-10">
          <TestimonialsCarousel testimonials={content.testimonials} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-charcoal/10 bg-gradient-brand px-8 py-12 text-center text-white md:py-16">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Ready to grow with strategy?
          </h2>
          <p className="max-w-xl text-white/85">
            Book a free marketing audit and get a clear, data-backed roadmap for
            your next quarter.
          </p>
          <Link
            href="/contact"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-charcoal transition-transform hover:scale-[1.02]"
          >
            Get Your Free Audit
          </Link>
        </div>
      </section>
    </div>
  );
}
