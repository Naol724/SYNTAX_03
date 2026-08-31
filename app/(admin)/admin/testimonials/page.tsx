"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Star, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { CrudTable, StatusBadge, type Column } from "@/components/admin/CrudTable";

interface Testimonial {
  testimonial_id: string;
  client_name: string;
  company_name: string | null;
  position_work: string | null;
  feedback: string;
  rating: number;
  is_approved: boolean;
  is_featured: boolean;
  project_type: string | null;
}

const EMPTY = { client_name: "", company_name: "", position_work: "", location: "", feedback: "", rating: 5, project_type: "", is_approved: false, is_featured: false, display_order: 0 };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-slate-600"}`} />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.testimonials.getAll({ page: String(page), limit: "10" });
      setData(res?.data ?? res ?? []);
      setTotal(res?.pagination?.total ?? res?.length ?? 0);
    } catch { toast.error("Failed to load testimonials"); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ client_name: t.client_name, company_name: t.company_name ?? "", position_work: t.position_work ?? "", location: "", feedback: t.feedback, rating: t.rating, project_type: t.project_type ?? "", is_approved: t.is_approved, is_featured: t.is_featured, display_order: 0 });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing ? await api.testimonials.update(editing.testimonial_id, form) : await api.testimonials.create(form);
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setOpen(false); load();
    } catch (err: any) { toast.error(err.message ?? "Save failed"); }
    finally { setSaving(false); }
  };

  const handleApprove = async (t: Testimonial) => {
    try {
      await api.testimonials.approve(t.testimonial_id);
      toast.success("Testimonial approved");
      load();
    } catch { toast.error("Failed to approve"); }
  };

  const columns: Column<Testimonial>[] = [
    { key: "client_name", label: "Client", render: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-white text-sm">{r.client_name}</p>
        <p className="text-[11px] text-gray-500 dark:text-slate-400">{r.company_name ?? r.position_work ?? ""}</p>
      </div>
    )},
    { key: "feedback", label: "Feedback", render: (r) => <span className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2 max-w-xs">{r.feedback}</span> },
    { key: "rating", label: "Rating", render: (r) => <StarRating rating={r.rating} /> },
    { key: "is_approved", label: "Approved", render: (r) => <StatusBadge active={r.is_approved} trueLabel="Approved" falseLabel="Pending" /> },
    { key: "is_featured", label: "Featured", render: (r) => <StatusBadge active={r.is_featured} /> },
  ];

  return (
    <>
      <CrudTable
        title="Testimonials" subtitle="Manage client reviews and feedback"
        data={data} columns={columns} total={total} page={page} limit={10} loading={loading}
        onSearch={() => {}} onPageChange={setPage}
        onAdd={openAdd} onEdit={openEdit}
        onDelete={async (id) => { await api.testimonials.delete(id); load(); }}
        idKey="testimonial_id" addLabel="Add Testimonial"
        extraActions={(r) => !r.is_approved ? (
          <Button size="sm" variant="ghost" onClick={() => handleApprove(r)} className="h-7 w-7 p-0" title="Approve">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </Button>
        ) : null}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Client Name *</Label>
                <Input required value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="ACME Corp" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Position / Title</Label>
                <Input value={form.position_work} onChange={(e) => setForm({ ...form, position_work: e.target.value })} placeholder="CEO" />
              </div>
              <div className="space-y-1.5">
                <Label>Project Type</Label>
                <Input value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} placeholder="Website, Mobile App..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Feedback *</Label>
              <Textarea required rows={4} value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} placeholder="Write the client's testimonial..." />
            </div>
            <div className="space-y-2">
              <Label>Rating: {form.rating} / 5</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}>
                    <Star className={`w-6 h-6 transition-colors ${s <= form.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_approved} onCheckedChange={(v) => setForm({ ...form, is_approved: v })} id="approved" />
                <Label htmlFor="approved">Approved</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} id="featured" />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
            <DialogFooter>
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
