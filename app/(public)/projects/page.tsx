"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, Layers, Filter, Grid, ChevronDown, Eye } from "lucide-react";
import {
  FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem,
  PageTransition, HoverCard
} from "@/components/ui/motion";
import { Gallery } from "@/components/ui/gallery";
import { ContactCTA } from "@/components/ui/cta";

const categories = ["All", "Healthcare", "Corporate", "E-Commerce", "EdTech", "Gaming", "Chatbot / Trading"];

const projects = [
  {
    id: "saron-orthopedic",
    name: "Saron Orthopedic Center",
    category: "Healthcare",
    url: "saronorthopediccenter.com",
    href: "https://saronorthopediccenter.com",
    desc: "Professional medical website with appointment booking, service listings, and patient information.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    emoji: "🏥",
    color: "red",
    status: "Live"
  },
  {
    id: "godu-trading",
    name: "Godu General Trading",
    category: "Chatbot / Trading",
    url: "godugt.com",
    href: "https://godugt.com",
    desc: "Corporate trading platform with AI chatbot for customer queries and automated support.",
    tech: ["React", "Node.js", "Telegram Bot"],
    emoji: "📦",
    color: "green",
    status: "Live"
  },
  {
    id: "vanguardx",
    name: "VanguardX Import & Export",
    category: "Corporate",
    url: "vanguardxie.com",
    href: "https://vanguardxie.com",
    desc: "Premium corporate website for an international import & export company.",
    tech: ["Next.js", "TypeScript", "AWS"],
    emoji: "🌍",
    color: "indigo",
    status: "Live"
  },
  {
    id: "zeban-security",
    name: "Zeban Security Services",
    category: "Corporate",
    url: "zebansecurityservices.com",
    href: "https://zebansecurityservices.com",
    desc: "Professional security company website with services, contact, and team profiles.",
    tech: ["React", "Tailwind CSS", "Node.js"],
    emoji: "🛡️",
    color: "slate",
    status: "Live"
  },
  {
    id: "dubai-furniture",
    name: "Dubai Furniture ET",
    category: "E-Commerce",
    url: "dubaifurnitureet.com",
    href: "https://dubaifurnitureet.com",
    desc: "Full e-commerce marketplace for premium furniture with catalog, cart, and payment.",
    tech: ["Next.js", "MongoDB", "Stripe"],
    emoji: "🛋️",
    color: "orange",
    status: "Live"
  },
  {
    id: "pin-trading",
    name: "Pin Trading",
    category: "Chatbot / Trading",
    url: "pintrading.et",
    href: "https://pintrading.et",
    desc: "Trading platform with Telegram bot for order automation and notifications.",
    tech: ["React", "Node.js", "Telegram Bot"],
    emoji: "📈",
    color: "yellow",
    status: "Live"
  },
  {
    id: "mela-exam",
    name: "Mela Exam Platform",
    category: "EdTech",
    url: "melaexam.com",
    href: "https://melaexam.com",
    desc: "Online exam platform with quiz engine, results, leaderboards, and admin dashboard.",
    tech: ["React", "Node.js", "PostgreSQL"],
    emoji: "📚",
    color: "purple",
    status: "Live"
  },
  {
    id: "king-bingo",
    name: "King Bingo",
    category: "Gaming",
    url: "kingbingo.et",
    href: "#",
    desc: "Real-time multiplayer online bingo platform with live rooms, payments & admin panel.",
    tech: ["React", "WebSocket", "Node.js", "PostgreSQL"],
    emoji: "🎰",
    color: "red",
    status: "Live"
  },
  {
    id: "award-bingo",
    name: "Award Bingo",
    category: "Gaming",
    url: "awardbingo.et",
    href: "#",
    desc: "Online bingo gaming platform with reward system, multiplayer, and payment gateway.",
    tech: ["React", "WebSocket", "MongoDB"],
    emoji: "🏆",
    color: "pink",
    status: "Live"
  },
  {
    id: "waza-bingo",
    name: "Waza Bingo",
    category: "Gaming",
    url: "wazabingo.et",
    href: "#",
    desc: "Feature-rich bingo platform with social gameplay, leaderboards, and multi-currency.",
    tech: ["React", "Node.js", "Firebase"],
    emoji: "🎯",
    color: "cyan",
    status: "Live"
  },
  {
    id: "dux-architects",
    name: "DUX Architects",
    category: "Corporate",
    url: "duxarchitects.com",
    href: "https://duxarchitects.com",
    desc: "Portfolio site showcasing architectural projects, design philosophy, and professional services.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    emoji: "🏛️",
    color: "blue",
    status: "Live"
  },
  {
    id: "kidest-cafe",
    name: "Kidest Shiro Cafe",
    category: "E-Commerce",
    url: "kidestshiro.com",
    href: "https://kidestshiro.com",
    desc: "Restaurant ordering platform with online menu, digital ordering, and delivery management.",
    tech: ["React", "Node.js", "MongoDB"],
    emoji: "☕",
    color: "orange",
    status: "Live"
  },
];

const colorMap: Record<string, { badge: string; tech: string; border: string }> = {
  red:    { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300", border: "hover:border-blue-300 dark:hover:border-blue-600" },
  green:  { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300", border: "hover:border-blue-300 dark:hover:border-blue-600" },
  indigo: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", tech: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300", border: "hover:border-indigo-300 dark:hover:border-indigo-600" },
  slate:  { badge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300", tech: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300", border: "hover:border-slate-300 dark:hover:border-slate-600" },
  orange: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", tech: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300", border: "hover:border-indigo-300 dark:hover:border-indigo-600" },
  yellow: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300", tech: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300", border: "hover:border-slate-300 dark:hover:border-slate-600" },
  purple: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", tech: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300", border: "hover:border-indigo-300 dark:hover:border-indigo-600" },
  pink:   { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300", border: "hover:border-blue-300 dark:hover:border-blue-600" },
  cyan:   { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300", border: "hover:border-blue-300 dark:hover:border-blue-600" },
  blue:   { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300", border: "hover:border-blue-300 dark:hover:border-blue-600" },
};

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10"
            >
              <Layers className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium">50+ Projects Delivered</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
            >
              Our Projects
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Real products, real clients — across healthcare, e-commerce, gaming, enterprise, and more. All live and running.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActive(cat)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mt-3 text-sm text-gray-400"
          >
            Showing <span className="font-bold text-gray-700 dark:text-gray-300">{filtered.length}</span> project{filtered.length !== 1 ? "s" : ""}
            {active !== "All" && <> in <span className="text-blue-600 dark:text-blue-400 font-bold">{active}</span></>}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const c = colorMap[project.color] || colorMap.blue;
                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="group flex flex-col h-full p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{project.emoji}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${c.badge}`}>
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-black text-gray-900 dark:text-white text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1">
                        {project.desc}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech.slice(0, 4).map((t) => (
                          <span key={t} className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${c.tech}`}>
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${project.status === 'Live' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{project.status}</span>
                        </div>

                        {project.href !== "#" ? (
                          <motion.a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, x: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400"
                          >
                            <span>{project.url}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </motion.a>
                        ) : (
                          <span className="text-sm text-gray-400 italic flex items-center gap-1">
                            <Grid className="w-3.5 h-3.5" />
                            Internal Project
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <ContactCTA />
    </PageTransition>
  );
}