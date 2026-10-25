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

interface Member {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  skills?: string[];
  yearsExperience?: number;
  linkedin?: string;
  github?: string;
  twitter?: string;
  active: boolean;
  order: number;
}

const EMPTY = {
  name: "",
  role: "",
  bio: "",
  image: "",
  email: "",
  skills: "",
  yearsExperience: 0,
  linkedin: "",
  github: "",
  twitter: "",
  active: true,
  order: 0,
};

export default function DevelopersPage() {
  const [data, setData] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch<{ members: Member[] }>("/api/team");
      let list = res.members || [];
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.role?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q)
        );
      }
      setTotal(list.length);
      const start = (page - 1) * 10;
      setData(list.slice(start, start + 10));
    } catch {
      toast.error("Failed to load team members");
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

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio || "",
      image: m.image || "",
      email: m.email || "",
      skills: m.skills?.join(", ") || "",
      yearsExperience: m.yearsExperience || 0,
      linkedin: m.linkedin || "",
      github: m.github || "",
      twitter: m.twitter || "",
      active: m.active,
      order: m.order || 0,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        bio: form.bio,
        image: form.image,
        email: form.email,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        yearsExperience: form.yearsExperience,
        linkedin: form.linkedin,
        github: form.github,
        twitter: form.twitter,
        active: form.active,
        order: form.order,
      };

      if (editing) {
        await adminFetch(`/api/team/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/team", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      toast.success(editing ? "Member updated" : "Member added");
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Member>[] = [
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
          <p className="text-[11px] text-gray-400">{r.email || "—"}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (r) => <span className="text-xs text-gray-600 dark:text-slate-400">{r.role}</span>,
    },
    {
      key: "skills",
      label: "Skills",
      render: (r) => <span className="text-xs">{r.skills?.slice(0, 3).join(", ") || "—"}</span>,
    },
    {
      key: "active",
      label: "Status",
      render: (r) => <StatusBadge active={r.active} />,
    },
    {
      key: "order",
      label: "Order",
      render: (r) => <span className="text-xs text-gray-500">#{r.order}</span>,
    },
  ];

  return (
    <>
      <CrudTable
        title="Team"
        subtitle="Manage developers and team members"
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
          await adminFetch(`/api/team/${id}`, { method: "DELETE" });
          load();
        }}
        idKey="_id"
        addLabel="Add Member"
        searchPlaceholder="Search team..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Member" : "New Team Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Naol Gonfa"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role / Position *</Label>
                <Input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Full-Stack Developer"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Short bio..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@syntax.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Years Experience</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.yearsExperience}
                  onChange={(e) =>
                    setForm({ ...form, yearsExperience: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Skills</Label>
              <Input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Avatar Image URL</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label>LinkedIn</Label>
                <Input
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>GitHub</Label>
                <Input
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Twitter</Label>
                <Input
                  value={form.twitter}
                  onChange={(e) => setForm({ ...form, twitter: e.target.value })}
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
              <div className="flex items-center gap-2 mt-5">
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) => setForm({ ...form, active: v })}
                />
                <Label>Active</Label>
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
