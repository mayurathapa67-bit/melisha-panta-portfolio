"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageField({
  label,
  value,
  onChange,
  aspect = "16/10",
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  aspect?: string;
}) {
  const current = value ?? "";
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed");
      }
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className="relative overflow-hidden rounded-xl border border-charcoal/15 bg-cream"
          style={{ width: 140, aspectRatio: aspect }}
        >
          {current ? (
            <Image
              src={current}
              alt={label}
              fill
              sizes="140px"
              className="object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-xs text-muted">
              No image
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal transition-colors hover:bg-teal/20">
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          {current && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>
      <input
        className="w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-teal"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
