"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Gamepad2, Building2, Bot, Palette,
  Cloud, Headset, ArrowRight, CheckCircle, Zap, Target,
  Shield, Clock, Users, Loader2, Layers
} from "lucide-react";
import {
  PageTransition,
} from "@/components/ui/motion";
import { TestimonialsGrid } from "@/components/ui/testimonials";
import { FAQSection } from "@/components/ui/faq";
import { ContactCTA } from "@/components/ui/cta";
import { Newsletter } from "@/components/ui/newsletter";
import { usePublicList } from "@/lib/use-public-content";

type ApiService = {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category?: string;
  languages?: string[];
  icon?: string;
  price?: string;
  active?: boolean;
  featured?: boolean;
  order?: number;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  globe: <Globe className="w-7 h-7" />,
  website: <Globe className="w-7 h-7" />,
  smartphone: <Smartphone className="w-7 h-7" />,
  mobile: <Smartphone className="w-7 h-7" />,
  gamepad: <Gamepad2 className="w-7 h-7" />,
  gaming: <Gamepad2 className="w-7 h-7" />,
  building: <Building2 className="w-7 h-7" />,
  enterprise: <Building2 className="w-7 h-7" />,
  bot: <Bot className="w-7 h-7" />,
  ai: <Bot className="w-7 h-7" />,
  palette: <Palette className="w-7 h-7" />,
  design: <Palette className="w-7 h-7" />,
  cloud: <Cloud className="w-7 h-7" />,
  headset: <Headset className="w-7 h-7" />,
  support: <Headset className="w-7 h-7" />,
  layers: <Layers className="w-7 h-7" />,
};

const STYLE_CYCLE = [
  { gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
  { gradient: "from-blue-600 to-indigo-600", iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" },
  { gradient: "from-indigo-500 to-blue-600", iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
  { gradient: "from-blue-700 to-indigo-700", iconBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
  { gradient: "from-blue-500 to-indigo-500", iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" },
  { gradient: "from-indigo-600 to-blue-700", iconBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300" },
];

function pickIcon(service: ApiService, index: number) {
  const key = (service.icon || service.category || service.name || "")
    .toLowerCase()
    .replace(/[^a-z]/g, " ")
    .trim()
    .split(/\s+/)[0];
  if (key && ICON_MAP[key]) return ICON_MAP[key];
  const fallbacks = [
    <Globe className="w-7 h-7" key="g" />,
    <Smartphone className="w-7 h-7" key="s" />,
    <Gamepad2 className="w-7 h-7" key="ga" />,
    <Building2 className="w-7 h-7" key="b" />,
    <Bot className="w-7 h-7" key="bo" />,
    <Palette className="w-7 h-7" key="p" />,
    <Cloud className="w-7 h-7" key="c" />,
    <Headset className="w-7 h-7" key="h" />,
  ];
  return fallbacks[index % fallbacks.length];
}

const process = [
  { step: "01", title: "Discovery", desc: "We learn your business goals, users, and requirements in a focused kickoff session." },
  { step: "02", title: "Design", desc: "Wireframes and high-fidelity mockups reviewed and approved before any code is written." },
  { step: "03", title: "Build", desc: "Agile sprint development with regular demos, clean code, and security reviews." },
  { step: "04", title: "Launch", desc: "Full deployment, handover, and ongoing 24/7 support after go-live." },
];

const commitments = [
  { icon: <Shield className="w-5 h-5" />, text: "Cybersecurity audit on every project" },
  { icon: <Target className="w-5 h-5" />, text: "Full product lifecycle ownership" },
  { icon: <CheckCircle className="w-5 h-5" />, text: "Clean, documented, maintainable code" },
  { icon: <Clock className="w-5 h-5" />, text: "24/7 post-launch support available" },
  { icon: <Zap className="w-5 h-5" />, text: "Agile sprints with regular demos" },
  { icon: <Users className="w-5 h-5" />, text: "Not a body shop — full team attention" },
];

export default function Services() {
  const { items: services, loading } = usePublicList<ApiService>(
    "/api/public/services",
    "services"
  );

  const display = services.map((s, index) => {
    const style = STYLE_CYCLE[index % STYLE_CYCLE.length];
    return {
      id: s._id,
      title: s.name,
      tagline: s.shortDescription || s.category || "",
      description: s.description,
      features: (s.languages || []).length
        ? s.languages!
        : [s.category, s.price].filter(Boolean) as string[],
      icon: pickIcon(s, index),
      ...style,
    };
  });

  return (
    <PageTransition>
      <section className="relative text-white py-32 overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-blue-800">
          <div className="absolute right-0 bottom-0 w-96 h-64 bg-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 opacity-10 z-10 dot-grid" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">
                {loading ? "Loading…" : `${display.length} Core Services`}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
            >
              Our Services
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
            >
              Full product lifecycle — from discovery and design through development, deployment, and long-term support. Building digital products that drive business growth.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 py-24 bg-white/15 dark:bg-gray-950/15 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">
              <Target className="w-3.5 h-3.5" /> What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Complete Software Solutions
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              From concept to launch and beyond — we offer end-to-end development services for businesses of all sizes.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : display.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No services published yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {display.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  id={service.id}
                  className="scroll-mt-32"
                >
                  <div className="group glass-card-hover-premium p-8 rounded-3xl h-full">
                    <div className="flex items-start gap-5 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.iconBg} shadow-lg`}
                      >
                        {service.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {service.title}
                        </h3>
                        {service.tagline ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {service.tagline}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {service.features.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {service.features.map((feature, i) => (
                          <div
                            key={`${service.id}-${i}`}
                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link href="/contact">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`ripple-button inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all`}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">
              <Target className="w-3.5 h-3.5" /> Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
              How We Work
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Agile, transparent, and delivery-focused. Every project gets full team attention.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-3xl font-black text-blue-600/20 dark:text-blue-400/20 mb-3">
                  {step.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commitments.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              >
                <div className="text-blue-600 dark:text-blue-400">{c.icon}</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
              What Clients Say
            </h2>
          </div>
          <TestimonialsGrid columns={3} />
        </div>
      </section>

      <FAQSection />
      <Newsletter />
      <ContactCTA />
    </PageTransition>
  );
}
