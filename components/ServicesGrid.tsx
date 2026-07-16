import type { ServiceItem } from "@/lib/types";
import Image from "next/image";

const ICONS: Record<string, string> = {
  search: "M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z",
  megaphone:
    "M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 11-5.8-1.6",
  share: "M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  mail: "M4 4h16v16H4zM4 6l8 6 8-6",
  compass: "M12 22a10 10 0 100-20 10 10 0 000 20zM16 8l-2 6-6 2 2-6 6-2z",
};

function Icon({ name }: { name: string }) {
  const path = ICONS[name] ?? ICONS.compass;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export default function ServicesGrid({
  services,
}: {
  services: ServiceItem[];
}) {
  const safe = Array.isArray(services) ? services : [];
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {safe.map((service) => (
        <div
          key={service.title}
          className="group flex flex-col rounded-2xl border border-charcoal/10 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-soft"
        >
          {service.image ? (
            <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-charcoal/10">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
            <Icon name={service.icon} />
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold text-charcoal">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {service.description}
          </p>

          <ul className="mt-4 space-y-2 text-sm text-charcoal/80">
            {Array.isArray(service.features) &&
              service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gradient-brand" />
                  <span>{feature}</span>
                </li>
              ))}
          </ul>

          <div className="mt-auto pt-6">
            <p className="font-display text-lg font-semibold text-charcoal">
              {service.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
