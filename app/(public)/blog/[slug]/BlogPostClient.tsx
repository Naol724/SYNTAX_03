"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Eye, Tag, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Blog {
  blog_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string;
  tags: string[] | null;
  author_name: string | null;
  publish_date: string | null;
  views_count: number;
  read_time_minutes: number | null;
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.blog.getBySlug(slug)
      .then((data: any) => setPost(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (notFound || !post) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-xl font-semibold text-foreground">Post not found</p>
      <Link href="/blog"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Blog</Button></Link>
    </div>
  );

  return (
    <article className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="capitalize">{post.category}</Badge>
            {post.read_time_minutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> {post.read_time_minutes} min read</span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="w-3 h-3" /> {post.views_count} views</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>}
          <div className="flex items-center gap-4 mt-5 pt-5 border-t border-border text-sm text-muted-foreground">
            {post.author_name && <span className="font-medium text-foreground">{post.author_name}</span>}
            {post.publish_date && (
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(post.publish_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            )}
          </div>
        </motion.header>

        {/* Featured image */}
        {post.featured_image_url && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-10">
            <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="prose prose-blue dark:prose-invert max-w-none prose-headings:font-bold prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </motion.div>
        )}

        {/* Footer CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">Have a project in mind?</h3>
          <p className="text-sm text-muted-foreground mb-4">Let's work together to bring your ideas to life.</p>
          <Link href="/contact">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">Get in Touch</Button>
          </Link>
        </motion.div>
      </div>
    </article>
  );
}
