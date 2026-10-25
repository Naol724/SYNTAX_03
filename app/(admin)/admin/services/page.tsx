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

interface Service {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category?: string;
  languages?: string[];
  icon?: string;
  price?: string;
  active: boolean;
  featured?: boolean;
  order: number;
}

const EMPTY = {
  name: "",
  category: "",
  description: "",
  shortDescription: "",
  languages: "",
  icon: "",
  price: "",
  active: true,
  featured: false,
  order: 0,
};

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
      const res = await adminFetch<{ services: Service[]; total: number }>("/api/services");
      let list = res.services || [];
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
        );
      }
      setTotal(list.length);
      const start = (page - 1) * 10;
      setData(list.slice(start, start + 10));
    } catch {
      toast.error("Failed to load services");
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

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      category: s.category || "",
      description: s.description,
      shortDescription: s.shortDescription || "",
      languages: s.languages?.join(", ") || "",
      icon: s.icon || "",
      price: s.price || "",
      active: s.active,
      featured: !!s.featured,
      order: s.order || 0,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        shortDescription: form.shortDescription,
        languages: form.languages
          ? form.languages.split(",").map((l) => l.trim()).filter(Boolean)
          : [],
        icon: form.icon,
        price: form.price,
        active: form.active,
        featured: form.featured,
        order: form.order,
        updatedAt: new Date().toISOString(),
      };

      if (editing) {
        await adminFetch(`/api/services/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      toast.success(editing ? "Service updated" : "Service created");
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Service>[] = [
    {
      key: "name",
      label: "Name",
      render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.name}</span>,
    },
    {
      key: "category",
      label: "Category",
      render: (r) => <span className="text-gray-600 dark:text-slate-400 text-xs">{r.category || "—"}</span>,
    },
    {
      key: "languages",
      label: "Tech",
      render: (r) => r.languages?.slice(0, 3).join(", ") || "—",
    },
    {
      key: "active",
      label: "Status",
      render: (r) => <StatusBadge active={r.active} />,
    },
    {
      key: "order",
      label: "Order",
      render: (r) => <span className="text-gray-500 dark:text-slate-400 text-xs">#{r.order}</span>,
    },
  ];

  return (
    <>
      <CrudTable
        title="Services"
        subtitle="Manage your company service offerings"
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
          await adminFetch(`/api/services/${id}`, { method: "DELETE" });
          load();
        }}
        idKey="_id"
        addLabel="Add Service"
        searchPlaceholder="Search services..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Web Development"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Website, Mobile, AI..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="short_desc">Short Description</Label>
              <Input
                id="short_desc"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="Brief summary"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description *</Label>
              <Textarea
                id="desc"
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Full service description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lang">Technologies</Label>
                <Input
                  id="lang"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  placeholder="React, Node.js"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="From $500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
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
                    id="active"
                    checked={form.active}
                    onCheckedChange={(v) => setForm({ ...form, active: v })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={form.featured}
                    onCheckedChange={(v) => setForm({ ...form, featured: v })}
                  />
                  <Label htmlFor="featured">Featured</Label>
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
