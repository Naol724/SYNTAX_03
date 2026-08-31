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
import Image from "next/image";

interface Developer {
  developer_id: string;
  full_name: string;
  position: string;
  skill: string[];
  email: string | null;
  years_of_experience: number | null;
  is_active: boolean;
  display_order: number;
  avatar_url: string | null;
}

const EMPTY = { full_name: "", position: "", bio: "", skill: "", email: "", phone_number: "", years_of_experience: 0, avatar_url: "", is_active: true, display_order: 0, linkedin: "", github: "", twitter: "" };

export default function DevelopersPage() {
  const [data, setData] = useState<Developer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Developer | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.developers.getAll({ page: String(page), limit: "10", ...(search ? { search } : {}) });
      setData(res?.data ?? res ?? []);
      setTotal(res?.pagination?.total ?? res?.length ?? 0);
    } catch { toast.error("Failed to load team members"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = async (d: Developer) => {
    const full: any = await api.developers.getById(d.developer_id).catch(() => d);
    setEditing(d);
    setForm({ full_name: full.full_name, position: full.position, bio: full.bio ?? "", skill: full.skill?.join(", ") ?? "", email: full.email ?? "", phone_number: full.phone_number ?? "", years_of_experience: full.years_of_experience ?? 0, avatar_url: full.avatar_url ?? "", is_active: full.is_active, display_order: full.display_order, linkedin: full.social_media_links?.linkedin ?? "", github: full.social_media_links?.github ?? "", twitter: full.social_media_links?.twitter ?? "" });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { full_name: form.full_name, position: form.position, bio: form.bio, skill: form.skill.split(",").map((s) => s.trim()).filter(Boolean), email: form.email, phone_number: form.phone_number, years_of_experience: Number(form.years_of_experience), avatar_url: form.avatar_url, is_active: form.is_active, display_order: Number(form.display_order), social_media_links: { linkedin: form.linkedin, github: form.github, twitter: form.twitter } };
      editing ? await api.developers.update(editing.developer_id, payload) : await api.developers.create(payload);
      toast.success(editing ? "Team member updated" : "Team member added");
      setOpen(false); load();
    } catch (err: any) { toast.error(err.message ?? "Save failed"); }
    finally { setSaving(false); }
  };

  const columns: Column<Developer>[] = [
    { key: "full_name", label: "Member", render: (r) => (
      <div className="flex items-center gap-3">
        {r.avatar_url ? (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image src={r.avatar_url} alt={r.full_name} width={32} height={32} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {r.full_name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{r.full_name}</p>
          <p className="text-[11px] text-gray-500 dark:text-slate-400">{r.position}</p>
        </div>
      </div>
    )},
    { key: "skill", label: "Skills", render: (r) => <span className="text-xs text-gray-600 dark:text-slate-400">{r.skill?.slice(0, 3).join(", ")}</span> },
    { key: "years_of_experience", label: "Experience", render: (r) => <span className="text-xs">{r.years_of_experience ? `${r.years_of_experience} yr${r.years_of_experience > 1 ? "s" : ""}` : "—"}</span> },
    { key: "is_active", label: "Status", render: (r) => <StatusBadge active={r.is_active} /> },
    { key: "display_order", label: "Order", render: (r) => <span className="text-xs text-gray-500">#{r.display_order}</span> },
  ];

  return (
    <>
      <CrudTable
        title="Team Members" subtitle="Manage developer and team profiles"
        data={data} columns={columns} total={total} page={page} limit={10} loading={loading}
        onSearch={(q) => { setSearch(q); setPage(1); }} onPageChange={setPage}
        onAdd={openAdd} onEdit={openEdit}
        onDelete={async (id) => { await api.developers.delete(id); load(); }}
        idKey="developer_id" addLabel="Add Member" searchPlaceholder="Search team..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Member" : "Add Team Member"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>Full Name *</Label>
                <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Alice Johnson" />
              </div>
              <div className="space-y-1.5">
                <Label>Position *</Label>
                <Input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Senior Full Stack Developer" />
              </div>
              <div className="space-y-1.5">
                <Label>Years of Experience</Label>
                <Input type="number" min={0} value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Skills * (comma-separated)</Label>
              <Input required value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} placeholder="React, TypeScript, Node.js" />
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Brief professional bio..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alice@syntax.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Avatar URL</Label>
                <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase">Social Links</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="LinkedIn URL" className="text-xs" />
                <Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="GitHub URL" className="text-xs" />
                <Input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} placeholder="Twitter URL" className="text-xs" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Display Order</Label>
                <Input type="number" min={0} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="w-20 h-8 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
