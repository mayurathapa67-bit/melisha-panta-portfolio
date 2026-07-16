"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-teal/30 bg-teal/5 p-8 text-center">
        <h3 className="font-display text-2xl font-semibold text-charcoal">
          Thank you!
        </h3>
        <p className="mt-2 text-sm text-muted">
          Your message is on its way. I&apos;ll be in touch within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-charcoal hover:text-cream"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-charcoal"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-charcoal/15 bg-card px-4 py-3 text-sm text-charcoal outline-none focus:border-teal"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-charcoal"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-charcoal/15 bg-card px-4 py-3 text-sm text-charcoal outline-none focus:border-teal"
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-charcoal"
        >
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-charcoal/15 bg-card px-4 py-3 text-sm text-charcoal outline-none focus:border-teal"
          placeholder="How can I help?"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-charcoal"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-charcoal/15 bg-card px-4 py-3 text-sm text-charcoal outline-none focus:border-teal"
          placeholder="Tell me about your goals…"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
