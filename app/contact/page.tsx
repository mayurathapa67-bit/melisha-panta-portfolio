import { getContent } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Melisha Panta for data-driven marketing strategy, or request a free marketing audit.",
};

export default async function ContactPage() {
  const content = await getContent();
  const contact = content.contact;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build your growth engine"
        description="Tell me about your goals, or request a free marketing audit. I typically reply within 24 hours."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-charcoal/10 bg-card p-8 shadow-soft">
          <ContactForm />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-charcoal/10 bg-gradient-brand p-6 text-white">
            <h3 className="font-display text-xl font-semibold">
              Free Marketing Audit
            </h3>
            <p className="mt-2 text-sm text-white/85">
              A 20-minute review of your funnel with 3 prioritized, actionable
              recommendations — on the house.
            </p>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
              Direct
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <span className="block text-xs uppercase tracking-wide">
                  Email
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-medium text-charcoal hover:text-teal"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wide">
                  Phone
                </span>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="font-medium text-charcoal hover:text-teal"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wide">
                  Location
                </span>
                <span className="font-medium text-charcoal">
                  {contact.location}
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
              Social
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {Array.isArray(contact.socials) &&
                contact.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-charcoal hover:text-teal"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
