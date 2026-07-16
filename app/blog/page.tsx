import { getContent } from "@/lib/content";
import BlogList from "@/components/BlogList";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marketing Insights",
  description:
    "Articles on SEO, PPC, social media, email, and marketing strategy from Digital Marketing Specialist Melisha Panta.",
};

export default async function BlogPage() {
  const content = await getContent();
  const posts = Array.isArray(content.blog)
    ? [...content.blog].sort((a, b) =>
        b.published_date.localeCompare(a.published_date)
      )
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <SectionHeading
        eyebrow="Blog"
        title="Marketing insights & playbooks"
        description="Practical, data-backed thinking on the channels that move the needle."
      />
      <div className="mt-12">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
