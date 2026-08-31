import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Blog — Syntax Software Solutions",
  description: "Insights, tutorials, and news from the Syntax Software Solutions team.",
};

export default function BlogPage() {
  return <BlogListClient />;
}
