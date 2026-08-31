"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Clock, Tag, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Blog {
  blog_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string;
  tags: string[] | null;
  author_name: string | null;
  publish_date: string | null;
  views_count: number;
  read_time_minutes: number | null;
  is_featured: boolean;
}

export default function BlogListClient() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: "9" };
    if (search) params.search = search;
    if (activeCategory !== "all") params.category = activeCategory;
    try {
      const [res, cats]: [any, any] = await Promise.all([
        api.blog.getPublic(params),
        categories.length ? Promise.resolve(categories) : api.blog.getCategories(),
      ]);
      setPosts(res?.data ?? res ?? []);
      setTotal(res?.pagination?.total ?? res?.length ?? 0);
      if (!categories.length) setCategories(cats ?? []);
    } catch { /* fallback to empty */ }
    finally { setLoading(false); }
  }, [page, search, activeCategory, categories.length]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 9);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="section-label">Our Blog</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mt-3 mb-4">
            Insights & <span className="gradient-text">Tutorials</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and news from the Syntax team.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search posts..." className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setActiveCategory("all"); setPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === "all" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.category} onClick={() => { setActiveCategory(c.category); setPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === c.category ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {c.category} <span className="opacity-70">({c.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No posts found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article key={post.blog_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {post.featured_image_url ? (
                      <Image src={post.featured_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
                        <span className="text-4xl">📝</span>
                      </div>
                    )}
                    {post.is_featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-blue-600 text-white text-[10px]">Featured</Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="text-[10px] capitalize">{post.category}</Badge>
                      {post.read_time_minutes && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3" /> {post.read_time_minutes} min read
                        </div>
                      )}
                    </div>
                    <h2 className="font-bold text-foreground mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-3">{post.excerpt}</p>}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {post.publish_date ? new Date(post.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
                      </div>
                      {post.author_name && <span className="text-xs text-muted-foreground">{post.author_name}</span>}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="gap-1.5">
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="gap-1.5">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
