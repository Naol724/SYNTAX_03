"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Layers, Filter, Grid, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import { ContactCTA } from "@/components/ui/cta";
import { usePublicList } from "@/lib/use-public-content";

type ApiProject = {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  category: string;
  thumbnail?: string;
  client?: string;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
};

const colorKeys = ["blue", "indigo", "slate", "cyan", "purple", "green", "orange", "pink", "red", "yellow"] as const;

const colorMap: Record<string, { badge: string; tech: string }> = {
  red: { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" },
  green: { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" },
  indigo: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", tech: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" },
  slate: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300", tech: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
  orange: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", tech: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" },
  yellow: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300", tech: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
  purple: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", tech: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" },
  pink: { badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" },
  cyan: { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" },
  blue: { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", tech: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" },
};

const emojiByCategory: Record<string, string> = {
  Healthcare: "🏥",
  Corporate: "🏢",
  "E-Commerce": "🛒",
  EdTech: "📚",
  Gaming: "🎮",
  "Chatbot / Trading": "🤖",
};

function hostLabel(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

export default function Projects() {
  const { items: projects, loading } = usePublicList<ApiProject>(
    "/api/public/portfolio",
    "projects"
  );
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const mapped = useMemo(
    () =>
      projects.map((p, i) => {
        const href = p.projectUrl || "#";
        return {
          id: p._id,
          name: p.title,
          category: p.category || "General",
          url: hostLabel(p.projectUrl) || "Internal",
          href,
          desc: p.description,
          tech: p.technologies || [],
          emoji: emojiByCategory[p.category] || "💻",
          color: colorKeys[i % colorKeys.length],
          status: href !== "#" ? "Live" : "Internal",
        };
      }),
    [projects]
  );

  const filtered =
    active === "All" ? mapped : mapped.filter((p) => p.category === active);

  return (
    <PageTransition>
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10">
              <Layers className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium">
                {loading ? "Loading…" : `${mapped.length}+ Projects Delivered`}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">Our Projects</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real products, real clients — across healthcare, e-commerce, gaming, enterprise, and more. All live and running.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-center mt-3 text-sm text-gray-400">
            Showing{" "}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {filtered.length}
            </span>{" "}
            project{filtered.length !== 1 ? "s" : ""}
            {active !== "All" && (
              <>
                {" "}
                in <span className="text-blue-600 dark:text-blue-400 font-bold">{active}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-24">No projects published yet.</p>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                    >
                      <div className="group flex flex-col h-full p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-4xl">{project.emoji}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${c.badge}`}>
                            {project.category}
                          </span>
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1">
                          {project.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tech.slice(0, 4).map((t) => (
                            <span key={t} className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${c.tech}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                project.status === "Live" ? "bg-blue-500" : "bg-slate-400"
                              }`}
                            />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {project.status}
                            </span>
                          </div>
                          {project.href !== "#" ? (
                            <a
                              href={project.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400"
                            >
                              <span>{project.url}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
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
          )}
        </div>
      </section>

      <ContactCTA />
    </PageTransition>
  );
}
