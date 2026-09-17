"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2, Loader2, Calendar, User } from "lucide-react";
import { toast } from "react-hot-toast";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  company?: string;
  phone?: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setMessages(data.messages || []);
      setTotal(data.total ?? data.messages?.length ?? 0);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 dark:text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading messages...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Contact form submissions from your website
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {total} total
        </Badge>
      </div>

      <Card className="border-gray-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" /> All Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{msg.name}</h3>
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {msg.subject}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-slate-400 mb-3">
                      <a
                        href={`mailto:${msg.email}`}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Mail className="w-4 h-4" />
                        {msg.email}
                      </a>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(msg.receivedAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 border border-gray-100 dark:border-slate-800">
                      {msg.message}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                    disabled={deletingId === msg._id}
                    onClick={() => handleDelete(msg._id)}
                  >
                    {deletingId === msg._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No contact messages yet</p>
                <p className="text-sm mt-1">Messages from the contact page will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
