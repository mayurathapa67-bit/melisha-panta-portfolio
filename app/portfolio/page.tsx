import { getContent } from "@/lib/content";
import PortfolioGrid from "@/components/PortfolioGrid";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Case Studies",
  description:
    "Explore data-driven marketing case studies across SEO, PPC, social media, content, and email — with real before/after results.",
};

export default async function PortfolioPage() {
  const content = await getContent();
  const studies = Array.isArray(content.portfolio) ? content.portfolio : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <SectionHeading
        eyebrow="Portfolio"
        title="Case studies with real numbers"
        description="Every engagement is measured against the metrics that matter. Filter by discipline or search by client."
      />
      <div className="mt-12">
        <PortfolioGrid studies={studies} />
      </div>
    </div>
  );
}
