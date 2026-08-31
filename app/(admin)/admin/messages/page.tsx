"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Search, Trash2, Archive, Eye, Loader2, ChevronLeft, ChevronRight, AlertTriangle, MessageSquare, CheckCheck, Inbox } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Message { message_id: string; sender_name: string; sender_email: string; subject: string; message: string; status: string; priority: string; message_type: string; created_at: string; admin_notes?: string; }
interface Stats { unread_count: number; read_count: number; responded_count: number; urgent_count: number; today_count: number; }

const STATUS_COLORS: Record<string, string> = { unread: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", read: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400", archived: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", responded: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
const PRIORITY_COLORS: Record<string, string> = { low: "text-gray-400", normal: "text-blue-400", high: "text-orange-400", urgent: "text-red-500" };

export default function MessagesPage() {
  const [data, setData] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: "15" };
    if (search) params.search = search;
    if (statusFilter !== "all") params.status = statusFilter;
    if (priorityFilter !== "all") params.priority = priorityFilter;
    try {
      const [msgs, s]: [any, any] = await Promise.all([api.messages.getAll(params), api.messages.getStats()]);
      setData(msgs?.data ?? msgs ?? []);
      setTotal(msgs?.pagination?.total ?? msgs?.length ?? 0);
      setStats(s);
    } catch { toast.error("Failed to load messages"); }
    finally { setLoading(false); }
  }, [page, search, statusFilter, priorityFilter]);

  useEffect(() => { load(); }, [load]);

  const openMessage = async (m: Message) => {
    setSelected(m);
    setNoteText(m.admin_notes ?? "");
    if (m.status === "unread") {
      try { await api.messages.update(m.message_id, { status: "read" }); load(); } catch {}
    }
  };

  const handleUpdate = async (status?: string, priority?: string) => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.messages.update(selected.message_id, { ...(status ? { status } : {}), ...(priority ? { priority } : {}), admin_notes: noteText });
      toast.success("Message updated");
      setSelected(null); load();
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  const handleArchive = async (id: string) => {
    try { await api.messages.archive(id); toast.success("Archived"); load(); } catch { toast.error("Failed to archive"); }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try { await api.messages.delete(deletingId); toast.success("Deleted"); setDeletingId(null); load(); } catch { toast.error("Delete failed"); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage contact form submissions</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Unread", value: stats.unread_count, icon: Inbox, color: "text-blue-500" },
            { label: "Read", value: stats.read_count, icon: Eye, color: "text-gray-400" },
            { label: "Responded", value: stats.responded_count, icon: CheckCheck, color: "text-emerald-500" },
            { label: "Urgent", value: stats.urgent_count, icon: AlertTriangle, color: "text-red-500" },
            { label: "Today", value: stats.today_count, icon: MessageSquare, color: "text-indigo-500" },
          ].map((s) => (
            <Card key={s.label} className="border-gray-200 dark:border-slate-800">
              <CardContent className="p-3 flex items-center gap-3">
                <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search messages..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-32 h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "unread", "read", "responded", "archived"].map((s) => <SelectItem key={s} value={s} className="text-sm capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1); }}>
          <SelectTrigger className="w-28 h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "urgent", "high", "normal", "low"].map((p) => <SelectItem key={p} value={p} className="text-sm capitalize">{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Message list */}
      <Card className="border-gray-200 dark:border-slate-800">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-slate-400 text-sm">No messages found</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {data.map((msg) => (
                <div key={msg.message_id} className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors ${msg.status === "unread" ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.status === "unread" ? "bg-blue-500" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openMessage(msg)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{msg.sender_name}</span>
                      <span className="text-xs text-gray-400 dark:text-slate-500">{msg.sender_email}</span>
                      <Badge className={`${STATUS_COLORS[msg.status]} text-[10px] px-1.5 py-0 h-4`}>{msg.status}</Badge>
                      {msg.priority !== "normal" && <span className={`text-[10px] font-medium uppercase ${PRIORITY_COLORS[msg.priority]}`}>{msg.priority}</span>}
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mt-0.5 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5 truncate">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[11px] text-gray-400 dark:text-slate-500 mr-1">{new Date(msg.created_at).toLocaleDateString()}</span>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleArchive(msg.message_id)} title="Archive">
                      <Archive className="w-3.5 h-3.5 text-gray-400 hover:text-yellow-500" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDeletingId(msg.message_id)} title="Delete">
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{total} messages</span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-3.5 h-3.5" /></Button>
            <span className="text-xs font-medium px-2">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      )}

      {/* Message detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">{selected?.subject}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500 dark:text-slate-400 text-xs">From</span><p className="font-medium">{selected.sender_name}</p></div>
                <div><span className="text-gray-500 dark:text-slate-400 text-xs">Email</span><p className="font-medium text-blue-600">{selected.sender_email}</p></div>
                <div><span className="text-gray-500 dark:text-slate-400 text-xs">Date</span><p>{new Date(selected.created_at).toLocaleString()}</p></div>
                <div><span className="text-gray-500 dark:text-slate-400 text-xs">Type</span><p className="capitalize">{selected.message_type}</p></div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {selected.message}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-xs">Status</Label>
                  <Select defaultValue={selected.status} onValueChange={(v) => handleUpdate(v)}>
                    <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{["unread","read","responded","archived"].map((s) => <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Priority</Label>
                  <Select defaultValue={selected.priority} onValueChange={(v) => handleUpdate(undefined, v)}>
                    <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{["low","normal","high","urgent"].map((p) => <SelectItem key={p} value={p} className="text-xs capitalize">{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Admin Notes</Label>
                <Textarea rows={2} className="mt-1 text-sm" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Internal notes..." />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelected(null)} className="text-sm">Close</Button>
            <a href={`mailto:${selected?.sender_email}?subject=Re: ${selected?.subject}`}>
              <Button variant="outline" className="gap-1.5 text-sm"><Mail className="w-3.5 h-3.5" /> Reply</Button>
            </a>
            <Button onClick={() => handleUpdate("responded")} disabled={saving} className="gap-1.5 text-sm">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this message?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
