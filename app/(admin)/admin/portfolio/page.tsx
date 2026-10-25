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
import { adminFetch } from "@/lib/admin-api";
import { CrudTable, StatusBadge, type Column } from "@/components/admin/CrudTable";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail?: string;
  images?: string[];
  client?: string;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  active: boolean;
  order: number;
}

const EMPTY = {
  title: "",
  category: "",
  description: "",
  technologies: "",
  projectUrl: "",
  githubUrl: "",
  thumbnail: "",
  client: "",
  featured: false,
  active: true,
  order: 0,
};

export default function PortfolioPage() {
  const [data, setData] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch<{ projects: Project[]; total: number }>("/api/portfolio");
      let list = res.projects || [];
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.client?.toLowerCase().includes(q)
        );
      }
      setTotal(list.length);
      const start = (page - 1) * 10;
      setData(list.slice(start, start + 10));
    } catch {
      toast.error("Failed to load portfolio");
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

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category,
      description: p.description,
      technologies: p.technologies?.join(", ") || "",
      projectUrl: p.projectUrl || "",
      githubUrl: p.githubUrl || "",
      thumbnail: p.thumbnail || p.images?.[0] || "",
      client: p.client || "",
      featured: p.featured,
      active: p.active,
      order: p.order || 0,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tech = form.technologies
        ? form.technologies.split(",").map((l) => l.trim()).filter(Boolean)
        : [];
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        technologies: tech,
        projectUrl: form.projectUrl,
        githubUrl: form.githubUrl,
        thumbnail: form.thumbnail,
        images: form.thumbnail ? [form.thumbnail] : [],
        client: form.client,
        featured: form.featured,
        active: form.active,
        order: form.order,
        updatedAt: new Date().toISOString(),
      };

      if (editing) {
        await adminFetch(`/api/portfolio/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/portfolio", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      toast.success(editing ? "Project updated" : "Project created");
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Project>[] = [
    {
      key: "title",
      label: "Project",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.thumbnail ? (
            <div className="w-10 h-8 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800 relative">
              <Image src={r.thumbnail} alt={r.title} width={40} height={32} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-8 rounded bg-gray-100 dark:bg-slate-800 flex-shrink-0" />
          )}
          <span className="font-medium text-gray-900 dark:text-white">{r.title}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (r) => <span className="text-xs text-gray-500 dark:text-slate-400">{r.category}</span>,
    },
    {
      key: "technologies",
      label: "Tech",
      render: (r) => (
        <span className="text-xs">{r.technologies?.slice(0, 3).join(", ") || "—"}</span>
      ),
    },
    {
      key: "active",
      label: "Published",
      render: (r) => <StatusBadge active={r.active} trueLabel="Live" falseLabel="Draft" />,
    },
    {
      key: "featured",
      label: "Featured",
      render: (r) => <StatusBadge active={r.featured} trueLabel="Featured" falseLabel="Normal" />,
    },
  ];

  return (
    <>
      <CrudTable
        title="Portfolio"
        subtitle="Manage your project showcase"
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
          await adminFetch(`/api/portfolio/${id}`, { method: "DELETE" });
          load();
        }}
        idKey="_id"
        addLabel="Add Project"
        searchPlaceholder="Search projects..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Project Name *</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="E-commerce Platform"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Website, Mobile, System..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Project description..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Technologies</Label>
              <Input
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                placeholder="Next.js, MongoDB, Tailwind"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Project URL</Label>
                <Input
                  value={form.projectUrl}
                  onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>GitHub URL</Label>
                <Input
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  placeholder="https://image..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Input
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="Client name"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <Label>Order</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-4 mt-5">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.active}
                    onCheckedChange={(v) => setForm({ ...form, active: v })}
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
