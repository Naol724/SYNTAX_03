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
import api from "@/lib/api";
import { CrudTable, StatusBadge, type Column } from "@/components/admin/CrudTable";

interface Service {
  service_id: string;
  name: string;
  type: string;
  language: string[] | null;
  short_description: string | null;
  description: string;
  is_active: boolean;
  display_order: number;
}

const EMPTY = { name: "", type: "", description: "", short_description: "", language: "", is_active: true, display_order: 0 };

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.services.getAll({ page: String(page), limit: "10", ...(search ? { search } : {}) });
      setData(Array.isArray(res) ? res : res?.data ?? []);
      setTotal(res?.pagination?.total ?? res?.length ?? 0);
    } catch { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, type: s.type, description: s.description, short_description: s.short_description ?? "", language: s.language?.join(", ") ?? "", is_active: s.is_active, display_order: s.display_order });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, language: form.language ? form.language.split(",").map((l) => l.trim()).filter(Boolean) : [] };
      editing ? await api.services.update(editing.service_id, payload) : await api.services.create(payload);
      toast.success(editing ? "Service updated" : "Service created");
      setOpen(false); load();
    } catch (err: any) { toast.error(err.message ?? "Save failed"); }
    finally { setSaving(false); }
  };

  const columns: Column<Service>[] = [
    { key: "name", label: "Name", render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.name}</span> },
    { key: "type", label: "Type", render: (r) => <span className="text-gray-600 dark:text-slate-400 text-xs">{r.type}</span> },
    { key: "language", label: "Languages", render: (r) => r.language?.join(", ") || "—" },
    { key: "is_active", label: "Status", render: (r) => <StatusBadge active={r.is_active} /> },
    { key: "display_order", label: "Order", render: (r) => <span className="text-gray-500 dark:text-slate-400 text-xs">#{r.display_order}</span> },
  ];

  return (
    <>
      <CrudTable
        title="Services" subtitle="Manage your company service offerings"
        data={data} columns={columns} total={total} page={page} limit={10} loading={loading}
        onSearch={(q) => { setSearch(q); setPage(1); }} onPageChange={setPage}
        onAdd={openAdd} onEdit={openEdit}
        onDelete={async (id) => { await api.services.delete(id); load(); }}
        idKey="service_id" addLabel="Add Service" searchPlaceholder="Search services..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Service Name *</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Web Development" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type *</Label>
                <Input id="type" required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="web-development" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="short_desc">Short Description</Label>
              <Input id="short_desc" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Brief summary (shown in cards)" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description *</Label>
              <Textarea id="desc" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Full service description..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lang">Languages / Technologies</Label>
              <Input id="lang" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} placeholder="React, Node.js, TypeScript" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" min={0} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="w-24" />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <Switch id="active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label htmlFor="active">Active</Label>
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
