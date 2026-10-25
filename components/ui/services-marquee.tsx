'use client';

import {
  Globe, Smartphone, Gamepad2, Building2, Bot, Cloud, Palette, Headset, Layers, Loader2
} from "lucide-react";
import { usePublicList } from "@/lib/use-public-content";

type ApiService = {
  _id: string;
  name: string;
  category?: string;
  icon?: string;
};

const ICON_CYCLE = [Globe, Smartphone, Gamepad2, Building2, Bot, Cloud, Palette, Headset, Layers];
const GRADIENT_CYCLE = [
  "from-blue-500 to-blue-700",
  "from-blue-600 to-indigo-600",
  "from-indigo-500 to-blue-600",
  "from-blue-700 to-indigo-700",
  "from-blue-500 to-indigo-500",
  "from-indigo-600 to-blue-600",
];

const ICON_BY_KEY: Record<string, typeof Globe> = {
  globe: Globe,
  website: Globe,
  smartphone: Smartphone,
  mobile: Smartphone,
  gamepad: Gamepad2,
  gaming: Gamepad2,
  building: Building2,
  enterprise: Building2,
  bot: Bot,
  cloud: Cloud,
  palette: Palette,
  design: Palette,
  headset: Headset,
  support: Headset,
};

export function ServicesMarquee() {
  const { items, loading } = usePublicList<ApiService>("/api/public/services", "services");

  const services = items.map((s, i) => {
    const key = (s.icon || s.category || s.name || "")
      .toLowerCase()
      .replace(/[^a-z]/g, " ")
      .trim()
      .split(/\s+/)[0];
    const Icon = (key && ICON_BY_KEY[key]) || ICON_CYCLE[i % ICON_CYCLE.length];
    return {
      id: s._id,
      title: s.name,
      Icon,
      gradient: GRADIENT_CYCLE[i % GRADIENT_CYCLE.length],
    };
  });

  const duplicatedServices =
    services.length > 0
      ? [...services, ...services, ...services]
      : [];

  return (
    <div className="relative overflow-hidden py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 md:mb-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold tracking-wide mb-4 sm:mb-6">
            Full-Stack Services
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">
            What We Build
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
            From MVPs to enterprise-grade systems — we cover the complete product lifecycle
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
        </div>
      ) : duplicatedServices.length === 0 ? (
        <p className="text-center text-gray-500 pb-8">No services published yet.</p>
      ) : (
        <div className="relative group">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-3 sm:gap-4 md:gap-6 animate-marquee group-hover:[animation-play-state:paused]">
            {duplicatedServices.map((service, index) => (
              <div
                key={`${service.id}-${index}`}
                className="flex-shrink-0 w-[240px] sm:w-[300px] md:w-[400px] glass-card-hover-premium group/card relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover/card:opacity-10 transition-opacity duration-500`} />

                <div className="relative flex items-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8">
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-2xl group-hover/card:scale-110 transition-transform duration-500`}>
                    <service.Icon className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-white" />
                  </div>

                  <h3 className="text-sm sm:text-lg md:text-2xl font-black text-gray-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000"
                  style={{ transform: "skewX(-20deg)" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
