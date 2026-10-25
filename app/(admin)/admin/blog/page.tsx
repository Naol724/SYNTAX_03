"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminFetch, slugify } from "@/lib/admin-api";
import { CrudTable, StatusBadge, type Column } from "@/components/admin/CrudTable";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  author?: string;
  published: boolean;
  featured?: boolean;
  views?: number;
  createdAt?: string;
}

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "",
  tags: "",
  author: "",
  published: false,
  featured: false,
};

export default function BlogPage() {
  const [data, setData] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await adminFetch<{ posts: Blog[]; total: number }>(
        `/api/blog?${params.toString()}`
      );
      setData(res.posts || []);
      setTotal(res.total ?? res.posts?.length ?? 0);
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (b: Blog) => {
    setEditing(b);
    setForm({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt || "",
      content: b.content,
      featuredImage: b.featuredImage || "",
      category: b.category || "",
      tags: b.tags?.join(", ") || "",
      author: b.author || "",
      published: b.published,
      featured: !!b.featured,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        featuredImage: form.featuredImage,
        category: form.category,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        author: form.author || "Admin",
        published: form.published,
        featured: form.featured,
        updatedAt: new Date().toISOString(),
      };

      if (editing) {
        await adminFetch(`/api/blog/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/blog", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      toast.success(editing ? "Post updated" : "Post created");
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (b: Blog) => {
    try {
      await adminFetch(`/api/blog/${b._id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !b.published, updatedAt: new Date().toISOString() }),
      });
      toast.success(b.published ? "Unpublished" : "Published");
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update");
    }
  };

  const columns: Column<Blog>[] = [
    {
      key: "title",
      label: "Title",
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{r.title}</p>
          <p className="text-[11px] text-gray-400">/{r.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (r) => <span className="text-xs text-gray-500">{r.category || "—"}</span>,
    },
    {
      key: "published",
      label: "Status",
      render: (r) => (
        <button type="button" onClick={() => togglePublish(r)}>
          <StatusBadge active={r.published} trueLabel="Published" falseLabel="Draft" />
        </button>
      ),
    },
    {
      key: "views",
      label: "Views",
      render: (r) => <span className="text-xs text-gray-500">{r.views ?? 0}</span>,
    },
  ];

  return (
    <>
      <CrudTable
        title="Blog"
        subtitle="Create and manage blog posts"
        data={data}
        columns={columns}
        total={total}
        page={page}
        limit={10}
        loading={loading}
        onSearch={(q) => {
          setSearch(q);
          setPage(1);
        }}
        onPageChange={setPage}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={async (id) => {
          await adminFetch(`/api/blog/${id}`, { method: "DELETE" });
          load();
        }}
        idKey="_id"
        addLabel="New Post"
        searchPlaceholder="Search posts..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: editing ? form.slug : slugify(title),
                  });
                }}
                placeholder="Post title"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Technology, Tips..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short summary"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <Textarea
                required
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your post content..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Featured Image URL</Label>
                <Input
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Admin"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tags</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="nextjs, web, ethiopia"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label>Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
                <Label>Featured</Label>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
