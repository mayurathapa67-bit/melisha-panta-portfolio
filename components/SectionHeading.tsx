export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal md:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 max-w-2xl text-base leading-relaxed text-muted ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
