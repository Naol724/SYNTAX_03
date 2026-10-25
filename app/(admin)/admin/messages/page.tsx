"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail, Trash2, Loader2, Calendar, User, Phone, RefreshCw, Reply, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminFetch } from "@/lib/admin-api";

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
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await adminFetch<{ messages: ContactMessage[]; total: number }>(
        "/api/admin/messages?limit=100"
      );
      setMessages(data.messages || []);
      setTotal(data.total ?? data.messages?.length ?? 0);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      await adminFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Messages visitors send from the website contact form
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {total} total
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={refreshing}
            onClick={() => load(true)}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" /> Inbox
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.map((msg) => {
              const open = expandedId === msg._id;
              return (
                <div
                  key={msg._id}
                  className="p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      className="flex-1 min-w-0 text-left"
                      onClick={() => setExpandedId(open ? null : msg._id)}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{msg.name}</h3>
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {msg.subject}
                        </Badge>
                        {open ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {msg.email}
                        </span>
                        {msg.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {msg.phone}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(msg.receivedAt)}
                        </span>
                      </div>

                      <p
                        className={`text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 border border-gray-100 dark:border-slate-800 ${
                          open ? "" : "line-clamp-2"
                        }`}
                      >
                        {msg.message}
                      </p>
                    </button>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(
                            `Re: ${msg.subject}`
                          )}`}
                          className="gap-1.5"
                        >
                          <Reply className="w-3.5 h-3.5" />
                          Reply
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                </div>
              );
            })}

            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No contact messages yet</p>
                <p className="text-sm mt-1">
                  When someone submits the contact form on your website, it will show up here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
