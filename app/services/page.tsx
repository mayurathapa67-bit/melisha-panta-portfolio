import Link from "next/link";
import { getContent } from "@/lib/content";
import ServicesGrid from "@/components/ServicesGrid";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services",
  description:
    "Marketing services including SEO, PPC, social media, email automation, and strategy — with clear deliverables, timelines, and pricing.",
};

export default async function ServicesPage() {
  const content = await getContent();
  const services = Array.isArray(content.services) ? content.services : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <SectionHeading
        eyebrow="Services"
        title="Full-funnel marketing, delivered"
        description="Flexible engagements built around your goals. Transparent deliverables, realistic timelines, and pricing that scales with you."
      />

      <div className="mt-12">
        <ServicesGrid services={services} />
      </div>

      <section className="mt-16 rounded-3xl border border-charcoal/10 bg-gradient-brand px-8 py-12 text-center text-white md:py-16">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Not sure where to start?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/85">
          Book a free marketing audit. I&apos;ll review your current funnel and
          share a prioritized roadmap — no obligation.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-charcoal transition-transform hover:scale-[1.02]"
        >
          Get Your Free Audit
        </Link>
      </section>
    </div>
  );
}
