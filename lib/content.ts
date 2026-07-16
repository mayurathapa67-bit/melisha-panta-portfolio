import fs from "fs";
import path from "path";
import type { SiteContent } from "./types";

const FALLBACK_CONTENT: SiteContent = {
  nav: {
    logo: "Melisha Panta",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Services", href: "/services" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  hero: {
    title: "Melisha Panta",
    role: "Digital Marketing Specialist",
    subtitle: "Driving measurable growth through data-driven marketing strategies",
    stats: [
      { label: "Avg ROI", value: "500%" },
      { label: "Revenue Generated", value: "$10M+" },
      { label: "Campaigns", value: "100+" },
    ],
    cta_primary: "View Case Studies",
    cta_secondary: "Get Free Audit",
    image: "/images/hero-melisha.jpg",
  },
  about: {
    headline: "Marketing Strategist",
    bio: "",
    philosophy: "",
    image: "",
    expertise: [],
    experience: [],
    certifications: [],
    tools: [],
  },
  services: [],
  portfolio: [],
  blog: [],
  testimonials: [],
  contact: {
    email: "pantamelisha700@gmail.com",
    phone: "+61 483 020 249",
    location: "Queensland, Australia / Kathmandu, Nepal",
    socials: [],
  },
};

export function getFallbackContent(): SiteContent {
  return FALLBACK_CONTENT;
}

function readLocalContent(): SiteContent {
  try {
    const filePath = path.join(process.cwd(), "content.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      nav: parsed.nav ?? FALLBACK_CONTENT.nav,
      hero: parsed.hero ?? FALLBACK_CONTENT.hero,
      about: parsed.about ?? FALLBACK_CONTENT.about,
      services: Array.isArray(parsed.services)
        ? parsed.services
        : FALLBACK_CONTENT.services,
      portfolio: Array.isArray(parsed.portfolio)
        ? parsed.portfolio
        : FALLBACK_CONTENT.portfolio,
      blog: Array.isArray(parsed.blog) ? parsed.blog : FALLBACK_CONTENT.blog,
      testimonials: Array.isArray(parsed.testimonials)
        ? parsed.testimonials
        : FALLBACK_CONTENT.testimonials,
      contact: parsed.contact ?? FALLBACK_CONTENT.contact,
    };
  } catch {
    return FALLBACK_CONTENT;
  }
}

async function readGitHubContent(): Promise<SiteContent | null> {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) {
    return null;
  }
  try {
    const url = `https://api.github.com/repos/${repo}/contents/content.json`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (!data.content) {
      return null;
    }
    const decoded =
      data.encoding === "base64"
        ? Buffer.from(data.content, "base64").toString("utf-8")
        : data.content;
    const parsed = JSON.parse(decoded) as Partial<SiteContent>;
    return {
      nav: parsed.nav ?? FALLBACK_CONTENT.nav,
      hero: parsed.hero ?? FALLBACK_CONTENT.hero,
      about: parsed.about ?? FALLBACK_CONTENT.about,
      services: Array.isArray(parsed.services)
        ? parsed.services
        : FALLBACK_CONTENT.services,
      portfolio: Array.isArray(parsed.portfolio)
        ? parsed.portfolio
        : FALLBACK_CONTENT.portfolio,
      blog: Array.isArray(parsed.blog) ? parsed.blog : FALLBACK_CONTENT.blog,
      testimonials: Array.isArray(parsed.testimonials)
        ? parsed.testimonials
        : FALLBACK_CONTENT.testimonials,
      contact: parsed.contact ?? FALLBACK_CONTENT.contact,
    };
  } catch {
    return null;
  }
}

export async function getContent(): Promise<SiteContent> {
  const github = await readGitHubContent();
  if (github) {
    return github;
  }
  return readLocalContent();
}
