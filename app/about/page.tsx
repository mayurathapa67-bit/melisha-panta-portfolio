import { getContent } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import AnimatedCounter from "@/components/AnimatedCounter";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "Meet Melisha Panta — a data-driven Digital Marketing Specialist with a proven record of measurable growth across SEO, PPC, social, content, and email.",
};

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;
  const experience = Array.isArray(about.experience) ? about.experience : [];
  const certifications = Array.isArray(about.certifications)
    ? about.certifications
    : [];
  const tools = Array.isArray(about.tools) ? about.tools : [];
  const expertise = Array.isArray(about.expertise) ? about.expertise : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
            {about.headline}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-charcoal md:text-5xl">
            Marketing that performs as good as it looks.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{about.bio}</p>

          <div className="mt-8 rounded-2xl border border-charcoal/10 bg-card p-6">
            <h3 className="font-display text-xl font-semibold text-charcoal">
              My Philosophy
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              {about.philosophy}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-charcoal/10 bg-gradient-brand shadow-soft">
            {about.image ? (
              <Image
                src={about.image}
                alt={about.headline}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.25),transparent_55%)] p-8">
                <div className="rounded-2xl bg-white/90 px-5 py-4 backdrop-blur">
                  <AnimatedCounter
                    value="$10M+"
                    className="block font-display text-3xl font-semibold text-gradient"
                  />
                  <p className="text-xs uppercase tracking-wide text-charcoal/70">
                    Revenue Generated
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-20">
        <SectionHeading eyebrow="Expertise" title="What I bring to the table" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-charcoal/10 bg-card px-4 py-3 text-sm font-medium text-charcoal"
            >
              <span className="h-2 w-2 flex-none rounded-full bg-gradient-brand" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Experience"
          title="A track record of quantifiable growth"
        />
        <div className="mt-8 space-y-6">
          {experience.map((item) => (
            <div
              key={`${item.company}-${item.role}`}
              className="relative rounded-2xl border border-charcoal/10 bg-card p-6 pl-7"
            >
              <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-brand" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  {item.role}
                </h3>
                <span className="text-sm font-medium text-teal">
                  {item.duration}
                </span>
              </div>
              <p className="text-sm font-medium text-muted">{item.company}</p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal/80">
                {Array.isArray(item.achievements) &&
                  item.achievements.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gradient-brand" />
                      <span>{a}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Credentials" title="Certifications" />
          <div className="mt-6 flex flex-wrap gap-3">
            {certifications.map((c) => (
              <span
                key={c}
                className="rounded-full border border-charcoal/15 bg-card px-4 py-2 text-sm font-medium text-charcoal"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Toolkit" title="Tools I use daily" />
          <div className="mt-6 flex flex-wrap gap-3">
            {tools.map((t) => (
              <span
                key={t}
                className="rounded-full border border-charcoal/15 bg-card px-4 py-2 text-sm font-medium text-charcoal"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
