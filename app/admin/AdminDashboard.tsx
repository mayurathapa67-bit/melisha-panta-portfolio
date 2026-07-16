"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";
import type {
  SiteContent,
  CaseStudy,
  BlogPost,
  ServiceItem,
  Category,
} from "@/lib/types";

type Tab = "content" | "submissions" | "settings";

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const CATEGORIES: Category[] = ["SEO", "PPC", "Social", "Content", "Email"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-teal";
const textareaCls = inputCls + " resize-y";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [githubConfigured, setGithubConfigured] = useState(false);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      const data = (await res.json()) as {
        ok: boolean;
        content?: SiteContent;
        githubConfigured?: boolean;
      };
      if (data.ok && data.content) {
        setContent(data.content);
        setGithubConfigured(Boolean(data.githubConfigured));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      const data = (await res.json()) as {
        ok: boolean;
        submissions?: Submission[];
      };
      if (data.ok && Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (tab !== "submissions") return;
    const id = setInterval(loadSubmissions, 8000);
    const initial = setTimeout(loadSubmissions, 0);
    return () => {
      clearInterval(id);
      clearTimeout(initial);
    };
  }, [tab, loadSubmissions]);

  const save = async (next: SiteContent) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: next }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Save failed.");
      }
      setContent(next);
      setMessage("Saved successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const update = (patch: Partial<SiteContent>) => {
    if (!content) return;
    setContent({ ...content, ...patch });
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 text-muted">Loading…</div>
    );
  }

  if (!content) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 text-muted">
        Failed to load content.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted">
            {githubConfigured
              ? "Editing syncs to GitHub (content.json)."
              : "Editing saves to local content.json."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/")}
            className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-charcoal/5"
          >
            View Site
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:bg-charcoal/5"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b border-charcoal/10">
        {(["content", "submissions", "settings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-teal text-charcoal"
                : "text-muted hover:text-charcoal"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-4 rounded-lg bg-teal/10 px-4 py-2 text-sm text-teal">
          {message}
        </p>
      )}

      {tab === "content" && (
        <ContentEditor
          content={content}
          update={update}
          save={save}
          saving={saving}
        />
      )}

      {tab === "submissions" && (
        <SubmissionsPanel
          submissions={submissions}
          expanded={expanded}
          setExpanded={setExpanded}
          onDelete={async (id) => {
            await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
              method: "DELETE",
            });
            loadSubmissions();
          }}
        />
      )}

      {tab === "settings" && (
        <SettingsPanel githubConfigured={githubConfigured} content={content} />
      )}
    </div>
  );
}

function ContentEditor({
  content,
  update,
  save,
  saving,
}: {
  content: SiteContent;
  update: (patch: Partial<SiteContent>) => void;
  save: (next: SiteContent) => void;
  saving: boolean;
}) {
  const [section, setSection] = useState("hero");

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr]">
      <nav className="flex flex-wrap gap-2 md:flex-col">
        {[
          "nav",
          "hero",
          "about",
          "services",
          "portfolio",
          "blog",
          "testimonials",
          "contact",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium capitalize transition-colors ${
              section === s
                ? "bg-charcoal text-cream"
                : "border border-charcoal/15 text-charcoal hover:bg-charcoal/5"
            }`}
          >
            {s}
          </button>
        ))}
      </nav>

      <div className="space-y-4 rounded-2xl border border-charcoal/10 bg-card p-6">
        {section === "nav" && (
          <NavEditor nav={content.nav} onChange={(nav) => update({ nav })} />
        )}
        {section === "hero" && (
          <HeroEditor
            hero={content.hero}
            onChange={(hero) => update({ hero })}
          />
        )}
        {section === "about" && (
          <AboutEditor
            about={content.about}
            onChange={(about) => update({ about })}
          />
        )}
        {section === "services" && (
          <ServicesEditor
            services={content.services}
            onChange={(services) => update({ services })}
          />
        )}
        {section === "portfolio" && (
          <PortfolioEditor
            portfolio={content.portfolio}
            onChange={(portfolio) => update({ portfolio })}
          />
        )}
        {section === "blog" && (
          <BlogEditor
            blog={content.blog}
            onChange={(blog) => update({ blog })}
          />
        )}
        {section === "testimonials" && (
          <TestimonialsEditor
            testimonials={content.testimonials}
            onChange={(testimonials) => update({ testimonials })}
          />
        )}
        {section === "contact" && (
          <ContactEditor
            contact={content.contact}
            onChange={(contact) => update({ contact })}
          />
        )}

        <button
          onClick={() => save(content)}
          disabled={saving}
          className="mt-4 w-full rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function NavEditor({
  nav,
  onChange,
}: {
  nav: SiteContent["nav"];
  onChange: (nav: SiteContent["nav"]) => void;
}) {
  const links = Array.isArray(nav.links) ? nav.links : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">
        Branding
      </h3>
      <Field label="Logo text">
        <input
          className={inputCls}
          value={nav.logo}
          onChange={(e) => onChange({ ...nav, logo: e.target.value })}
        />
      </Field>
      <ImageField
        label="Logo image (optional)"
        value={nav.logoImage ?? ""}
        aspect="1/1"
        onChange={(logoImage) => onChange({ ...nav, logoImage })}
      />
      <div className="space-y-2">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted">
          Nav links
        </span>
        {links.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls}
              placeholder="Label"
              value={l.label}
              onChange={(e) => {
                const next = [...links];
                next[i] = { ...l, label: e.target.value };
                onChange({ ...nav, links: next });
              }}
            />
            <input
              className={inputCls}
              placeholder="Href"
              value={l.href}
              onChange={(e) => {
                const next = [...links];
                next[i] = { ...l, href: e.target.value };
                onChange({ ...nav, links: next });
              }}
            />
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...nav,
              links: [...links, { label: "New", href: "/" }],
            })
          }
          className="text-sm font-medium text-teal hover:underline"
        >
          + Add link
        </button>
      </div>
    </div>
  );
}

function HeroEditor({
  hero,
  onChange,
}: {
  hero: SiteContent["hero"];
  onChange: (hero: SiteContent["hero"]) => void;
}) {
  const stats = Array.isArray(hero.stats) ? hero.stats : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">Hero</h3>
      <Field label="Title">
        <input
          className={inputCls}
          value={hero.title}
          onChange={(e) => onChange({ ...hero, title: e.target.value })}
        />
      </Field>
      <Field label="Role">
        <input
          className={inputCls}
          value={hero.role}
          onChange={(e) => onChange({ ...hero, role: e.target.value })}
        />
      </Field>
      <Field label="Subtitle">
        <textarea
          className={textareaCls}
          rows={2}
          value={hero.subtitle}
          onChange={(e) => onChange({ ...hero, subtitle: e.target.value })}
        />
      </Field>
      <Field label="Primary CTA">
        <input
          className={inputCls}
          value={hero.cta_primary}
          onChange={(e) => onChange({ ...hero, cta_primary: e.target.value })}
        />
      </Field>
      <Field label="Secondary CTA">
        <input
          className={inputCls}
          value={hero.cta_secondary}
          onChange={(e) => onChange({ ...hero, cta_secondary: e.target.value })}
        />
      </Field>
      <ImageField
        label="Hero image"
        value={hero.image}
        aspect="4/5"
        onChange={(image) => onChange({ ...hero, image })}
      />
      <div className="space-y-2">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted">
          Stats
        </span>
        {stats.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls}
              placeholder="Value"
              value={s.value}
              onChange={(e) => {
                const next = [...stats];
                next[i] = { ...s, value: e.target.value };
                onChange({ ...hero, stats: next });
              }}
            />
            <input
              className={inputCls}
              placeholder="Label"
              value={s.label}
              onChange={(e) => {
                const next = [...stats];
                next[i] = { ...s, label: e.target.value };
                onChange({ ...hero, stats: next });
              }}
            />
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...hero,
              stats: [...stats, { label: "New Stat", value: "0%" }],
            })
          }
          className="text-sm font-medium text-teal hover:underline"
        >
          + Add stat
        </button>
      </div>
    </div>
  );
}

function AboutEditor({
  about,
  onChange,
}: {
  about: SiteContent["about"];
  onChange: (about: SiteContent["about"]) => void;
}) {
  const listEdit = (
    key: "expertise" | "certifications" | "tools",
    value: string
  ) =>
    onChange({
      ...about,
      [key]: value
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    });

  const experience = Array.isArray(about.experience) ? about.experience : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">About</h3>
      <Field label="Headline">
        <input
          className={inputCls}
          value={about.headline}
          onChange={(e) => onChange({ ...about, headline: e.target.value })}
        />
      </Field>
      <Field label="Bio">
        <textarea
          className={textareaCls}
          rows={4}
          value={about.bio}
          onChange={(e) => onChange({ ...about, bio: e.target.value })}
        />
      </Field>
      <Field label="Philosophy">
        <textarea
          className={textareaCls}
          rows={3}
          value={about.philosophy}
          onChange={(e) => onChange({ ...about, philosophy: e.target.value })}
        />
      </Field>
      <ImageField
        label="About image"
        value={about.image}
        aspect="4/5"
        onChange={(image) => onChange({ ...about, image })}
      />
      <Field label="Expertise (one per line)">
        <textarea
          className={textareaCls}
          rows={4}
          value={about.expertise.join("\n")}
          onChange={(e) => listEdit("expertise", e.target.value)}
        />
      </Field>
      <Field label="Certifications (one per line)">
        <textarea
          className={textareaCls}
          rows={3}
          value={about.certifications.join("\n")}
          onChange={(e) => listEdit("certifications", e.target.value)}
        />
      </Field>
      <Field label="Tools (one per line)">
        <textarea
          className={textareaCls}
          rows={3}
          value={about.tools.join("\n")}
          onChange={(e) => listEdit("tools", e.target.value)}
        />
      </Field>
      <div className="space-y-2">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted">
          Experience
        </span>
        {experience.map((exp, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-charcoal/10 p-3">
            <input
              className={inputCls}
              placeholder="Role"
              value={exp.role}
              onChange={(e) => {
                const next = [...experience];
                next[i] = { ...exp, role: e.target.value };
                onChange({ ...about, experience: next });
              }}
            />
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Company"
                value={exp.company}
                onChange={(e) => {
                  const next = [...experience];
                  next[i] = { ...exp, company: e.target.value };
                  onChange({ ...about, experience: next });
                }}
              />
              <input
                className={inputCls}
                placeholder="Duration"
                value={exp.duration}
                onChange={(e) => {
                  const next = [...experience];
                  next[i] = { ...exp, duration: e.target.value };
                  onChange({ ...about, experience: next });
                }}
              />
            </div>
            <textarea
              className={textareaCls}
              rows={3}
              placeholder="Achievements (one per line)"
              value={exp.achievements.join("\n")}
              onChange={(e) => {
                const next = [...experience];
                next[i] = {
                  ...exp,
                  achievements: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter((s) => s !== ""),
                };
                onChange({ ...about, experience: next });
              }}
            />
            <button
              onClick={() =>
                onChange({
                  ...about,
                  experience: experience.filter((_, j) => j !== i),
                })
              }
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...about,
              experience: [
                ...experience,
                { role: "", company: "", duration: "", achievements: [] },
              ],
            })
          }
          className="text-sm font-medium text-teal hover:underline"
        >
          + Add experience
        </button>
      </div>
    </div>
  );
}

function ServicesEditor({
  services,
  onChange,
}: {
  services: ServiceItem[];
  onChange: (services: ServiceItem[]) => void;
}) {
  const safe = Array.isArray(services) ? services : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">
        Services
      </h3>
      {safe.map((s, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-charcoal/10 p-3">
          <div className="flex gap-2">
            <input
              className={inputCls}
              placeholder="Title"
              value={s.title}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...s, title: e.target.value };
                onChange(next);
              }}
            />
            <input
              className={inputCls}
              placeholder="Icon"
              value={s.icon}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...s, icon: e.target.value };
                onChange(next);
              }}
            />
            <input
              className={inputCls}
              placeholder="Price"
              value={s.price}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...s, price: e.target.value };
                onChange(next);
              }}
            />
          </div>
          <textarea
            className={textareaCls}
            rows={2}
            placeholder="Description"
            value={s.description}
            onChange={(e) => {
              const next = [...safe];
              next[i] = { ...s, description: e.target.value };
              onChange(next);
            }}
          />
          <textarea
            className={textareaCls}
            rows={3}
            placeholder="Features (one per line)"
            value={s.features.join("\n")}
            onChange={(e) => {
              const next = [...safe];
              next[i] = {
                ...s,
                features: e.target.value
                  .split("\n")
                  .map((x) => x.trim())
                  .filter((x) => x !== ""),
              };
              onChange(next);
            }}
          />
          <button
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
          <ImageField
            label="Image (optional)"
            value={s.image ?? ""}
            onChange={(image) => {
              const next = [...safe];
              next[i] = { ...s, image };
              onChange(next);
            }}
          />
        </div>
      ))}
      <button
        onClick={() =>
          onChange([
            ...safe,
            {
              title: "New Service",
              description: "",
              icon: "compass",
              price: "From $0",
              image: "",
              features: [],
            },
          ])
        }
        className="text-sm font-medium text-teal hover:underline"
      >
        + Add service
      </button>
    </div>
  );
}

function PortfolioEditor({
  portfolio,
  onChange,
}: {
  portfolio: CaseStudy[];
  onChange: (portfolio: CaseStudy[]) => void;
}) {
  const safe = Array.isArray(portfolio) ? portfolio : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">
        Case Studies
      </h3>
      {safe.map((cs, i) => (
        <details
          key={cs.slug || i}
          className="rounded-lg border border-charcoal/10 p-3"
        >
          <summary className="cursor-pointer font-medium text-charcoal">
            {cs.title || "New case study"}
          </summary>
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Slug"
                value={cs.slug}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = { ...cs, slug: e.target.value };
                  onChange(next);
                }}
              />
              <select
                className={inputCls}
                value={cs.category}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = {
                    ...cs,
                    category: e.target.value as Category,
                  };
                  onChange(next);
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <input
              className={inputCls}
              placeholder="Title"
              value={cs.title}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...cs, title: e.target.value };
                onChange(next);
              }}
            />
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Client"
                value={cs.client}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = { ...cs, client: e.target.value };
                  onChange(next);
                }}
              />
              <input
                className={inputCls}
                placeholder="Industry"
                value={cs.industry}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = { ...cs, industry: e.target.value };
                  onChange(next);
                }}
              />
            </div>
            <textarea
              className={textareaCls}
              rows={2}
              placeholder="Executive summary"
              value={cs.executive_summary}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...cs, executive_summary: e.target.value };
                onChange(next);
              }}
            />
            <textarea
              className={textareaCls}
              rows={2}
              placeholder="Challenge"
              value={cs.challenge}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...cs, challenge: e.target.value };
                onChange(next);
              }}
            />
            <textarea
              className={textareaCls}
              rows={2}
              placeholder="Strategy"
              value={cs.strategy}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...cs, strategy: e.target.value };
                onChange(next);
              }}
            />
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Traffic growth"
                value={cs.results.traffic_growth}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = {
                    ...cs,
                    results: { ...cs.results, traffic_growth: e.target.value },
                  };
                  onChange(next);
                }}
              />
              <input
                className={inputCls}
                placeholder="Conversion rate"
                value={cs.results.conversion_rate}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = {
                    ...cs,
                    results: { ...cs.results, conversion_rate: e.target.value },
                  };
                  onChange(next);
                }}
              />
              <input
                className={inputCls}
                placeholder="ROI"
                value={cs.results.roi}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = {
                    ...cs,
                    results: { ...cs.results, roi: e.target.value },
                  };
                  onChange(next);
                }}
              />
            </div>
            <ImageField
              label="Featured image"
              value={cs.featured_image}
              onChange={(url) => {
                const next = [...safe];
                next[i] = { ...cs, featured_image: url };
                onChange(next);
              }}
            />
            <button
              onClick={() => onChange(safe.filter((_, j) => j !== i))}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </details>
      ))}
      <button
        onClick={() =>
          onChange([
            ...safe,
            {
              slug: `case-${Date.now()}`,
              title: "New Case Study",
              category: "SEO",
              client: "",
              industry: "",
              challenge: "",
              strategy: "",
              executive_summary: "",
              results: { traffic_growth: "", conversion_rate: "", roi: "" },
              metrics: [],
              chart_data: [],
              published_date: new Date().toISOString().slice(0, 10),
              featured_image: "",
            },
          ])
        }
        className="text-sm font-medium text-teal hover:underline"
      >
        + Add case study
      </button>
    </div>
  );
}

function BlogEditor({
  blog,
  onChange,
}: {
  blog: BlogPost[];
  onChange: (blog: BlogPost[]) => void;
}) {
  const safe = Array.isArray(blog) ? blog : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">
        Blog Posts
      </h3>
      {safe.map((p, i) => (
        <details
          key={p.slug || i}
          className="rounded-lg border border-charcoal/10 p-3"
        >
          <summary className="cursor-pointer font-medium text-charcoal">
            {p.title || "New post"}
          </summary>
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="Slug"
                value={p.slug}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = { ...p, slug: e.target.value };
                  onChange(next);
                }}
              />
              <input
                className={inputCls}
                placeholder="Category"
                value={p.category}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = { ...p, category: e.target.value };
                  onChange(next);
                }}
              />
              <input
                className={inputCls}
                placeholder="Read time"
                value={p.read_time}
                onChange={(e) => {
                  const next = [...safe];
                  next[i] = { ...p, read_time: e.target.value };
                  onChange(next);
                }}
              />
            </div>
            <input
              className={inputCls}
              placeholder="Title"
              value={p.title}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...p, title: e.target.value };
                onChange(next);
              }}
            />
            <textarea
              className={textareaCls}
              rows={2}
              placeholder="Excerpt"
              value={p.excerpt}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...p, excerpt: e.target.value };
                onChange(next);
              }}
            />
            <textarea
              className={textareaCls}
              rows={5}
              placeholder="Content (separate paragraphs with a blank line)"
              value={p.content}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...p, content: e.target.value };
                onChange(next);
              }}
            />
            <ImageField
              label="Featured image"
              value={p.featured_image}
              onChange={(url) => {
                const next = [...safe];
                next[i] = { ...p, featured_image: url };
                onChange(next);
              }}
            />
            <button
              onClick={() => onChange(safe.filter((_, j) => j !== i))}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </details>
      ))}
      <button
        onClick={() =>
          onChange([
            ...safe,
            {
              slug: `post-${Date.now()}`,
              title: "New Post",
              excerpt: "",
              content: "",
              published_date: new Date().toISOString().slice(0, 10),
              read_time: "5 min",
              category: "Strategy",
              featured_image: "",
            },
          ])
        }
        className="text-sm font-medium text-teal hover:underline"
      >
        + Add post
      </button>
    </div>
  );
}

function TestimonialsEditor({
  testimonials,
  onChange,
}: {
  testimonials: SiteContent["testimonials"];
  onChange: (testimonials: SiteContent["testimonials"]) => void;
}) {
  const safe = Array.isArray(testimonials) ? testimonials : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">
        Testimonials
      </h3>
      {safe.map((t, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-charcoal/10 p-3">
          <textarea
            className={textareaCls}
            rows={2}
            placeholder="Quote"
            value={t.quote}
            onChange={(e) => {
              const next = [...safe];
              next[i] = { ...t, quote: e.target.value };
              onChange(next);
            }}
          />
          <div className="flex gap-2">
            <input
              className={inputCls}
              placeholder="Name"
              value={t.name}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...t, name: e.target.value };
                onChange(next);
              }}
            />
            <input
              className={inputCls}
              placeholder="Role"
              value={t.role}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...t, role: e.target.value };
                onChange(next);
              }}
            />
            <input
              className={inputCls}
              placeholder="Company"
              value={t.company}
              onChange={(e) => {
                const next = [...safe];
                next[i] = { ...t, company: e.target.value };
                onChange(next);
              }}
            />
          </div>
          <ImageField
            label="Avatar (optional)"
            value={t.avatar}
            aspect="1/1"
            onChange={(avatar) => {
              const next = [...safe];
              next[i] = { ...t, avatar };
              onChange(next);
            }}
          />
          <button
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          onChange([
            ...safe,
            { quote: "", name: "", role: "", company: "", avatar: "" },
          ])
        }
        className="text-sm font-medium text-teal hover:underline"
      >
        + Add testimonial
      </button>
    </div>
  );
}

function ContactEditor({
  contact,
  onChange,
}: {
  contact: SiteContent["contact"];
  onChange: (contact: SiteContent["contact"]) => void;
}) {
  const socials = Array.isArray(contact.socials) ? contact.socials : [];
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold text-charcoal">
        Contact
      </h3>
      <Field label="Email">
        <input
          className={inputCls}
          value={contact.email}
          onChange={(e) => onChange({ ...contact, email: e.target.value })}
        />
      </Field>
      <Field label="Phone">
        <input
          className={inputCls}
          value={contact.phone}
          onChange={(e) => onChange({ ...contact, phone: e.target.value })}
        />
      </Field>
      <Field label="Location">
        <input
          className={inputCls}
          value={contact.location}
          onChange={(e) => onChange({ ...contact, location: e.target.value })}
        />
      </Field>
      <div className="space-y-2">
        <span className="block text-xs font-medium uppercase tracking-wide text-muted">
          Socials
        </span>
        {socials.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls}
              placeholder="Label"
              value={s.label}
              onChange={(e) => {
                const next = [...socials];
                next[i] = { ...s, label: e.target.value };
                onChange({ ...contact, socials: next });
              }}
            />
            <input
              className={inputCls}
              placeholder="URL"
              value={s.href}
              onChange={(e) => {
                const next = [...socials];
                next[i] = { ...s, href: e.target.value };
                onChange({ ...contact, socials: next });
              }}
            />
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...contact,
              socials: [...socials, { label: "New", href: "" }],
            })
          }
          className="text-sm font-medium text-teal hover:underline"
        >
          + Add social
        </button>
      </div>
    </div>
  );
}

function SubmissionsPanel({
  submissions,
  expanded,
  setExpanded,
  onDelete,
}: {
  submissions: Submission[];
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  onDelete: (id: string) => void;
}) {
  if (submissions.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-charcoal/10 bg-card p-8 text-center text-muted">
        No contact submissions yet.
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-3">
      <p className="text-xs text-muted">
        Auto-refreshing every 8 seconds.
      </p>
      {submissions.map((s) => (
        <div
          key={s.id}
          className="rounded-2xl border border-charcoal/10 bg-card p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-charcoal">{s.name}</p>
              <p className="text-sm text-muted">
                {s.email} · {s.subject}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setExpanded(expanded === s.id ? null : s.id)
                }
                className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-charcoal/5"
              >
                {expanded === s.id ? "Hide" : "View"}
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted">
            {new Date(s.created_at).toLocaleString()}
          </p>
          {expanded === s.id && (
            <p className="mt-3 whitespace-pre-wrap rounded-lg bg-cream p-3 text-sm text-charcoal/80">
              {s.message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SettingsPanel({
  githubConfigured,
  content,
}: {
  githubConfigured: boolean;
  content: SiteContent;
}) {
  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-charcoal/10 bg-card p-6">
      <h3 className="font-display text-xl font-semibold text-charcoal">
        Settings
      </h3>
      <div className="space-y-2 text-sm">
        <SettingRow label="GitHub integration" value={githubConfigured ? "Enabled" : "Disabled"} />
        <SettingRow
          label="Storage target"
          value={githubConfigured ? "content.json in repo" : "local content.json"}
        />
        <SettingRow
          label="Case studies"
          value={`${Array.isArray(content.portfolio) ? content.portfolio.length : 0}`}
        />
        <SettingRow
          label="Blog posts"
          value={`${Array.isArray(content.blog) ? content.blog.length : 0}`}
        />
        <SettingRow
          label="Services"
          value={`${Array.isArray(content.services) ? content.services.length : 0}`}
        />
      </div>
      <p className="text-xs text-muted">
        To enable GitHub sync and Cloudinary image uploads, configure the
        environment variables in <code>.env.local</code> (see README).
      </p>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-charcoal/10 py-2">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-charcoal">{value}</span>
    </div>
  );
}
