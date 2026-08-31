"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Loader2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Portfolio {
  portfolio_id: string;
  project_name: string;
  portfolio_type: string;
  language_used: string[] | null;
  project_link: string | null;
  github_link: string | null;
  image_url: string | null;
  description: string;
  short_description: string | null;
  client_name: string | null;
  is_featured: boolean;
  views_count: number;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [activeType, setActiveType] = useState("all");
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Portfolio | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: "9" };
    if (activeType !== "all") params.type = activeType;
    try {
      const res: any = await api.portfolio.getPublic(params);
      const data = res?.data ?? res ?? [];
      setProjects(data);
      setTotal(res?.pagination?.total ?? data.length);
      if (!types.length && data.length) {
        const uniqueTypes = [...new Set<string>(data.map((p: Portfolio) => p.portfolio_type))];
        setTypes(uniqueTypes);
      }
    } catch { /* show empty */ }
    finally { setLoading(false); }
  }, [page, activeType, types.length]);

  useEffect(() => { load(); }, [load]);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="section-label">Our Work</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mt-3 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of the solutions we've built for our clients across industries.
          </p>
        </motion.div>

        {/* Filters */}
        {types.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["all", ...types].map((t) => (
              <button key={t} onClick={() => { setActiveType(t); setPage(1); }} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${activeType === t ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {t === "all" ? "All Projects" : t.replace("-", " ")}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No projects found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div key={p.portfolio_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => setSelected(p)}
              >
                <div className="relative h-52 bg-muted overflow-hidden">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.project_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
                      <span className="text-5xl">🖼️</span>
                    </div>
                  )}
                  {p.is_featured && <div className="absolute top-3 left-3"><Badge className="bg-blue-600 text-white text-[10px]">Featured</Badge></div>}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <div className="text-white text-sm font-medium flex items-center gap-1.5"><Eye className="w-4 h-4" /> View Details</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-foreground leading-snug">{p.project_name}</h3>
                    <Badge variant="outline" className="text-[10px] capitalize flex-shrink-0">{p.portfolio_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.short_description ?? p.description}</p>
                  {p.language_used && (
                    <div className="flex flex-wrap gap-1">
                      {p.language_used.slice(0, 4).map((lang) => <Badge key={lang} variant="secondary" className="text-[10px]">{lang}</Badge>)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(total / 9) > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 9)}</span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 9)} onClick={() => setPage((p) => p + 1)}>Next →</Button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {selected.image_url && (
              <div className="relative h-56 bg-muted"><Image src={selected.image_url} alt={selected.project_name} fill className="object-cover rounded-t-2xl" /></div>
            )}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-foreground">{selected.project_name}</h2>
                <Badge variant="outline" className="capitalize flex-shrink-0">{selected.portfolio_type}</Badge>
              </div>
              {selected.client_name && <p className="text-sm text-muted-foreground">Client: <span className="font-medium text-foreground">{selected.client_name}</span></p>}
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
              {selected.language_used && (
                <div className="flex flex-wrap gap-1.5">{selected.language_used.map((l) => <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>)}</div>
              )}
              <div className="flex items-center gap-3 pt-2">
                {selected.project_link && (
                  <a href={selected.project_link} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700"><ExternalLink className="w-3.5 h-3.5" /> Live Demo</Button>
                  </a>
                )}
                {selected.github_link && (
                  <a href={selected.github_link} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</Button>
                  </a>
                )}
                <Button size="sm" variant="ghost" onClick={() => setSelected(null)} className="ml-auto">Close</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
