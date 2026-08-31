"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Loader2, Bot, User, Trash2,
  Mail, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── Constants ────────────────────────────────────────────────
const CHAT_KEY = "syntax_chat_messages";

const QUICK_PROMPTS = [
  "What services do you offer?",
  "How much does a website cost?",
  "Can I see your portfolio?",
  "How do I get started?",
];

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Main widget ──────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [unread, setUnread]     = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // ── Restore messages from sessionStorage ─────────────────
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(CHAT_KEY);
      if (stored) setMessages(JSON.parse(stored));
    } catch {}
  }, []);

  // ── Persist messages to sessionStorage ───────────────────
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // ── Scroll to bottom on new messages ─────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Focus input when opened ───────────────────────────────
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(0);
    }
  }, [open]);

  // ── Send message to /api/ai/chat ──────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const trimmed = text.trim();
    setInput("");

    const userMsg: ChatMessage = { id: genId(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const reply = data.ai_response ?? data.message ?? "I'm not sure how to answer that.";

      const aiMsg: ChatMessage = { id: genId(), role: "assistant", content: reply };
      setMessages((prev) => [...prev, aiMsg]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again or email us at **syntaxsoftwaresolution@gmail.com**.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, open]);

  // ── Clear chat ────────────────────────────────────────────
  const clearChat = () => {
    setMessages([]);
    try { sessionStorage.removeItem(CHAT_KEY); } catch {}
  };

  // ── Render markdown-lite content ─────────────────────────
  const renderContent = (content: string) => (
    <div
      className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 [&_strong]:font-semibold [&_a]:text-blue-400 [&_a]:underline"
      dangerouslySetInnerHTML={{
        __html: content
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/`(.*?)`/g, '<code class="bg-black/10 dark:bg-white/10 px-1 rounded text-xs">$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
          .replace(/\n\n/g, "</p><p>")
          .replace(/\n/g, "<br/>"),
      }}
    />
  );

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* ── Floating toggle button ───────────────────────── */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0,  opacity: 1 }}
            exit={{   rotate: 90,  opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.div>
        </AnimatePresence>

        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </motion.button>

      {/* ── Chat window ──────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 20,  scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] flex flex-col rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-none">Syntax AI Assistant</p>
                <p className="text-[11px] text-blue-200 mt-0.5">Ask me anything about our services</p>
              </div>
              <button
                onClick={clearChat}
                className="text-blue-200 hover:text-white transition-colors flex-shrink-0"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white dark:bg-slate-900">

              {/* Welcome state */}
              {isEmpty && (
                <div className="space-y-3">
                  <div className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Hi! 👋 I'm the Syntax AI assistant. How can I help you today?
                      </p>
                    </div>
                  </div>

                  {/* Quick prompts */}
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Contact shortcuts */}
                  <div className="pl-8 pt-1 flex gap-2">
                    <a
                      href="mailto:syntaxsoftwaresolution@gmail.com"
                      className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Mail className="w-3 h-3" /> Email us
                    </a>
                    <a
                      href="tel:+251945455141"
                      className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Call us
                    </a>
                  </div>
                </div>
              )}

              {/* Conversation messages */}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      msg.role === "user"
                        ? "bg-blue-600"
                        : "bg-gradient-to-br from-blue-500 to-indigo-500"
                    }`}
                  >
                    {msg.role === "user"
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Bot  className="w-3.5 h-3.5 text-white" />
                    }
                  </div>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  disabled={loading}
                  className="flex-1 h-9 text-sm rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !input.trim()}
                  className="h-9 w-9 p-0 rounded-xl bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send    className="w-4 h-4" />
                  }
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
