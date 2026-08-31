"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { CrudTable, StatusBadge, type Column } from "@/components/admin/CrudTable";
import Image from "next/image";

interface Portfolio {
  portfolio_id: string;
  project_name: string;
  portfolio_type: string;
  language_used: string[] | null;
  project_link: string | null;
  image_url: string | null;
  description: string;
  client_name: string | null;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
}

const EMPTY = { project_name: "", portfolio_type: "", description: "", short_description: "", language_used: "", project_link: "", github_link: "", image_url: "", client_name: "", is_featured: false, is_published: true, display_order: 0 };

export default function PortfolioPage() {
  const [data, setData] = useState<Portfolio[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.portfolio.getAll({ page: String(page), limit: "10", ...(search ? { search } : {}) });
      setData(res?.data ?? res ?? []);
      setTotal(res?.pagination?.total ?? res?.length ?? 0);
    } catch { toast.error("Failed to load portfolio"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (p: Portfolio) => {
    setEditing(p);
    setForm({ project_name: p.project_name, portfolio_type: p.portfolio_type, description: p.description, short_description: "", language_used: p.language_used?.join(", ") ?? "", project_link: p.project_link ?? "", github_link: "", image_url: p.image_url ?? "", client_name: p.client_name ?? "", is_featured: p.is_featured, is_published: p.is_published, display_order: 0 });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, language_used: form.language_used ? form.language_used.split(",").map((l) => l.trim()).filter(Boolean) : [] };
      editing ? await api.portfolio.update(editing.portfolio_id, payload) : await api.portfolio.create(payload);
      toast.success(editing ? "Portfolio updated" : "Portfolio item created");
      setOpen(false); load();
    } catch (err: any) { toast.error(err.message ?? "Save failed"); }
    finally { setSaving(false); }
  };

  const columns: Column<Portfolio>[] = [
    {
      key: "project_name", label: "Project",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.image_url ? (
            <div className="w-10 h-8 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800">
              <Image src={r.image_url} alt={r.project_name} width={40} height={32} className="w-full h-full object-cover" />
            </div>
          ) : <div className="w-10 h-8 rounded bg-gray-100 dark:bg-slate-800 flex-shrink-0" />}
          <span className="font-medium text-gray-900 dark:text-white">{r.project_name}</span>
        </div>
      )
    },
    { key: "portfolio_type", label: "Type", render: (r) => <span className="text-xs text-gray-500 dark:text-slate-400">{r.portfolio_type}</span> },
    { key: "language_used", label: "Tech Stack", render: (r) => <span className="text-xs">{r.language_used?.slice(0, 3).join(", ") || "—"}</span> },
    { key: "is_published", label: "Published", render: (r) => <StatusBadge active={r.is_published} trueLabel="Live" falseLabel="Draft" /> },
    { key: "is_featured", label: "Featured", render: (r) => <StatusBadge active={r.is_featured} trueLabel="Featured" falseLabel="Normal" /> },
    { key: "views_count", label: "Views", render: (r) => <span className="text-xs text-gray-500 dark:text-slate-400">{r.views_count}</span> },
  ];

  return (
    <>
      <CrudTable
        title="Portfolio" subtitle="Manage your project showcase"
        data={data} columns={columns} total={total} page={page} limit={10} loading={loading}
        onSearch={(q) => { setSearch(q); setPage(1); }} onPageChange={setPage}
        onAdd={openAdd} onEdit={openEdit}
        onDelete={async (id) => { await api.portfolio.delete(id); load(); }}
        idKey="portfolio_id" addLabel="Add Project" searchPlaceholder="Search projects..."
        extraActions={(r) => r.project_link ? (
          <a href={r.project_link} target="_blank" rel="noreferrer">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><ExternalLink className="w-3.5 h-3.5 text-gray-400" /></Button>
          </a>
        ) : null}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>Project Name *</Label>
                <Input required value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} placeholder="E-Commerce Platform" />
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Input required value={form.portfolio_type} onChange={(e) => setForm({ ...form, portfolio_type: e.target.value })} placeholder="website, mobile-app, api" />
              </div>
              <div className="space-y-1.5">
                <Label>Client Name</Label>
                <Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="ACME Corp" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tech Stack</Label>
              <Input value={form.language_used} onChange={(e) => setForm({ ...form, language_used: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Live URL</Label>
                <Input value={form.project_link} onChange={(e) => setForm({ ...form, project_link: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label>GitHub URL</Label>
                <Input value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="https://github.com/..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project description..." />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} id="pub" />
                <Label htmlFor="pub">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} id="feat" />
                <Label htmlFor="feat">Featured</Label>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
