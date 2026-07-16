import Link from "next/link";

const FALLBACK_SOCIALS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/melishapanta" },
  { label: "Instagram", href: "https://www.instagram.com/melisha.panta" },
  { label: "X / Twitter", href: "https://x.com/melishapanta" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-charcoal/10 bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-display text-2xl font-semibold text-charcoal"
            >
              Melisha<span className="text-gradient"> Panta</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Digital Marketing Specialist driving measurable growth through
              data-driven strategy. Queensland, Australia / Kathmandu, Nepal.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <Link href="/about" className="hover:text-charcoal">
                  About
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-charcoal">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-charcoal">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-charcoal">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-charcoal">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
              Connect
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {FALLBACK_SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-charcoal"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:pantamelisha700@gmail.com"
                  className="hover:text-charcoal"
                >
                  pantamelisha700@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-charcoal/10 pt-6 text-xs text-muted md:flex-row">
          <p>© {year} Melisha Panta. All rights reserved.</p>
          <p>Crafted with strategy & elegance.</p>
        </div>
      </div>
    </footer>
  );
}
