"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2, Calendar, User } from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  company?: string;
  phone?: string;
  budget?: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages");
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages || []);
        setTotal(data.total ?? data.messages?.length ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Messages submitted from the contact form
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {total} total
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {msg.name}
                      </h3>
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {msg.subject}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {msg.email}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(msg.receivedAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
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
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No contact messages yet</p>
                <p className="text-sm mt-1">
                  Messages from the contact page will appear here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
