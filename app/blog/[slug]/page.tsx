import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const post = Array.isArray(content.blog)
    ? content.blog.find((p) => p.slug === slug)
    : undefined;
  if (!post) return { title: "Article Not Found" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const posts = Array.isArray(content.blog) ? content.blog : [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split("\n\n").filter((p) => p.trim() !== "");

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Link
        href="/blog"
        className="text-sm font-medium text-teal hover:underline"
      >
        ← All articles
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs text-muted">
        <span className="rounded-full bg-teal/10 px-2.5 py-1 font-semibold text-teal">
          {post.category}
        </span>
        <span>{formatDate(post.published_date)}</span>
        <span>· {post.read_time} read</span>
      </div>

      <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-charcoal md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>

      <div className="mt-8 h-48 rounded-2xl bg-gradient-brand">
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
      </div>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-charcoal/90">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-charcoal/10 bg-card p-8 text-center shadow-soft">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Work with me
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Have a project in mind? Let&apos;s build a strategy that performs.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-full bg-gradient-brand px-7 py-3 text-sm font-semibold text-white"
        >
          Get in Touch
        </Link>
      </div>
    </article>
  );
}
