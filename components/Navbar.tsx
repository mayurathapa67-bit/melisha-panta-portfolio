"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = FALLBACK_LINKS;
  const closeMenu = () => setOpen(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const [logoImage, setLogoImage] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.content?.nav?.logoImage) {
          setLogoImage(d.content.nav.logoImage);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-charcoal"
        >
          {logoImage ? (
            <span className="relative block h-8 w-8">
              <Image
                src={logoImage}
                alt="Melisha Panta"
                fill
                sizes="32px"
                className="rounded-full object-cover"
              />
            </span>
          ) : null}
          Melisha<span className="text-gradient"> Panta</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenu}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-charcoal"
                    : "text-muted hover:text-charcoal"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-brand"
                  />
                )}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/admin"
              onClick={closeMenu}
              className="rounded-full border border-charcoal/15 px-4 py-1.5 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-cream"
            >
              Admin
            </Link>
          </li>
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-charcoal transition-transform ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-charcoal transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-5 bg-charcoal transition-transform ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-charcoal/10 glass md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive(link.href)
                        ? "bg-charcoal/5 text-charcoal"
                        : "text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
