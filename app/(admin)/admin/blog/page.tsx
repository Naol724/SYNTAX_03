"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { CrudTable, StatusBadge, type Column } from "@/components/admin/CrudTable";

interface Blog {
  blog_id: string;
  title: string;
  slug: string;
  category: string;
  author_name: string | null;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  publish_date: string | null;
  tags: string[] | null;
}

const EMPTY = { title: "", content: "", excerpt: "", category: "Technology", tags: "", author_name: "Syntax Team", featured_image_url: "", is_published: false, is_featured: false, seo_title: "", seo_description: "" };

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
      const res: any = await api.blog.getAll({ page: String(page), limit: "10", ...(search ? { search } : {}) });
      setData(res?.data ?? res ?? []);
      setTotal(res?.pagination?.total ?? res?.length ?? 0);
    } catch { toast.error("Failed to load blog posts"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = async (b: Blog) => {
    const full: any = await api.blog.getById(b.blog_id).catch(() => b);
    setEditing(b);
    setForm({ title: full.title, content: full.content ?? "", excerpt: full.excerpt ?? "", category: full.category, tags: full.tags?.join(", ") ?? "", author_name: full.author_name ?? "Syntax Team", featured_image_url: full.featured_image_url ?? "", is_published: full.is_published, is_featured: full.is_featured, seo_title: full.seo_title ?? "", seo_description: full.seo_description ?? "" });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [], publish_date: form.is_published ? new Date().toISOString() : undefined };
      editing ? await api.blog.update(editing.blog_id, payload) : await api.blog.create(payload);
      toast.success(editing ? "Post updated" : "Post created");
      setOpen(false); load();
    } catch (err: any) { toast.error(err.message ?? "Save failed"); }
    finally { setSaving(false); }
  };

  const togglePublish = async (b: Blog) => {
    try {
      b.is_published ? await api.blog.unpublish(b.blog_id) : await api.blog.publish(b.blog_id);
      toast.success(b.is_published ? "Post unpublished" : "Post published");
      load();
    } catch { toast.error("Failed to update status"); }
  };

  const columns: Column<Blog>[] = [
    { key: "title", label: "Title", render: (r) => <span className="font-medium text-gray-900 dark:text-white max-w-xs truncate block">{r.title}</span> },
    { key: "category", label: "Category", render: (r) => <span className="text-xs text-gray-500 dark:text-slate-400">{r.category}</span> },
    { key: "author_name", label: "Author", render: (r) => <span className="text-xs">{r.author_name ?? "—"}</span> },
    { key: "is_published", label: "Status", render: (r) => <StatusBadge active={r.is_published} trueLabel="Published" falseLabel="Draft" /> },
    { key: "views_count", label: "Views", render: (r) => <span className="text-xs text-gray-500">{r.views_count}</span> },
  ];

  return (
    <>
      <CrudTable
        title="Blog" subtitle="Create and manage blog posts"
        data={data} columns={columns} total={total} page={page} limit={10} loading={loading}
        onSearch={(q) => { setSearch(q); setPage(1); }} onPageChange={setPage}
        onAdd={openAdd} onEdit={openEdit}
        onDelete={async (id) => { await api.blog.delete(id); load(); }}
        idKey="blog_id" addLabel="New Post" searchPlaceholder="Search posts..."
        extraActions={(r) => (
          <Button size="sm" variant="ghost" onClick={() => togglePublish(r)} className="h-7 w-7 p-0" title={r.is_published ? "Unpublish" : "Publish"}>
            {r.is_published ? <EyeOff className="w-3.5 h-3.5 text-orange-500" /> : <Eye className="w-3.5 h-3.5 text-green-500" />}
          </Button>
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Getting Started with Next.js 15" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {["Technology", "Tutorial", "Development", "Design", "Business", "News"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Author</Label>
                <Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder="Syntax Team" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="nextjs, react, typescript" />
            </div>
            <div className="space-y-1.5">
              <Label>Featured Image URL</Label>
              <Input value={form.featured_image_url} onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary shown in blog listing..." />
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <Textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your blog post content here..." className="font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>SEO Title</Label>
                <Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} placeholder="Optional SEO title override" />
              </div>
              <div className="space-y-1.5">
                <Label>SEO Description</Label>
                <Input value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} placeholder="Meta description for search engines" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} id="pub" />
                <Label htmlFor="pub">Publish Now</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} id="feat" />
                <Label htmlFor="feat">Featured Post</Label>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editing ? "Update" : "Publish"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
