import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${params.slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: "Blog Post — Syntax" };
    const data = await res.json();
    const post = data.data ?? data;
    return {
      title: `${post.seo_title ?? post.title} — Syntax Software Solutions`,
      description: post.seo_description ?? post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt ?? "",
        images: post.featured_image_url ? [post.featured_image_url] : [],
      },
    };
  } catch {
    return { title: "Blog Post — Syntax Software Solutions" };
  }
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostClient slug={params.slug} />;
}
