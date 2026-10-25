"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminFetch } from "@/lib/admin-api";
import { CrudTable, StatusBadge, type Column } from "@/components/admin/CrudTable";

interface Testimonial {
  _id: string;
  name: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  active: boolean;
  featured?: boolean;
  order: number;
}

const EMPTY = {
  name: "",
  company: "",
  content: "",
  rating: 5,
  image: "",
  active: true,
  featured: false,
  order: 0,
};

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch<{ testimonials: Testimonial[]; total: number }>(
        "/api/testimonials"
      );
      let list = res.testimonials || [];
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.company?.toLowerCase().includes(q) ||
            t.content.toLowerCase().includes(q)
        );
      }
      setTotal(list.length);
      const start = (page - 1) * 10;
      setData(list.slice(start, start + 10));
    } catch {
      toast.error("Failed to load testimonials");
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

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      company: t.company || "",
      content: t.content,
      rating: t.rating || 5,
      image: t.image || "",
      active: t.active,
      featured: !!t.featured,
      order: t.order || 0,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing) {
        await adminFetch(`/api/testimonials/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Testimonial>[] = [
    {
      key: "name",
      label: "Client",
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
          <p className="text-[11px] text-gray-400">{r.company || "—"}</p>
        </div>
      ),
    },
    {
      key: "content",
      label: "Feedback",
      render: (r) => <span className="text-xs line-clamp-2 max-w-xs">{r.content}</span>,
    },
    {
      key: "rating",
      label: "Rating",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-xs text-amber-500">
          <Star className="w-3.5 h-3.5 fill-current" /> {r.rating}
        </span>
      ),
    },
    {
      key: "active",
      label: "Approved",
      render: (r) => <StatusBadge active={r.active} trueLabel="Approved" falseLabel="Hidden" />,
    },
    {
      key: "featured",
      label: "Featured",
      render: (r) => <StatusBadge active={!!r.featured} trueLabel="Featured" falseLabel="—" />,
    },
  ];

  return (
    <>
      <CrudTable
        title="Testimonials"
        subtitle="Manage client feedback and reviews"
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
          await adminFetch(`/api/testimonials/${id}`, { method: "DELETE" });
          load();
        }}
        idKey="_id"
        addLabel="Add Testimonial"
        searchPlaceholder="Search testimonials..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Client Name *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Abebe Kebede"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Feedback *</Label>
              <Textarea
                required
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="What the client said..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Rating (1–5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Photo URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
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
                  <Label>Approved</Label>
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
