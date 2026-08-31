"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Loader2, Bot, User, Trash2,
  ThumbsUp, ThumbsDown, WifiOff, Mail, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chat_id?: string;
  feedback?: boolean | null;
}

// ─── Constants ────────────────────────────────────────────────
const SESSION_KEY = "syntax_chat_session";

const QUICK_PROMPTS = [
  "What services do you offer?",
  "How much does a website cost?",
  "Can I see your portfolio?",
  "How do I get started?",
];

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getSession(): string {
  if (typeof window === "undefined") return genId();
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) return stored;
  const id = genId();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

// ─── Offline fallback panel ───────────────────────────────────
function OfflinePanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <WifiOff className="w-7 h-7 text-amber-500" />
      </div>
      <div>
        <p className="font-bold text-gray-900 dark:text-white text-base mb-1">
          AI chat is currently offline
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Our AI assistant requires a backend connection. Reach us directly:
        </p>
      </div>
      <div className="w-full space-y-2.5 mt-1">
        <a
          href="mailto:syntaxsoftwaresolution@gmail.com"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
        >
          <Mail className="w-4 h-4 flex-shrink-0" />
          syntaxsoftwaresolution@gmail.com
        </a>
        <a
          href="tel:+251911000000"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          Call or WhatsApp us
        </a>
      </div>
    </div>
  );
}

// ─── Main widget ─────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [unread, setUnread]       = useState(0);
  const [backendOk, setBackendOk] = useState<boolean | null>(null); // null = unknown

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // ── Init session & probe backend ──────────────────────────
  useEffect(() => {
    const id = getSession();
    setSessionId(id);

    // Load chat history and use result to decide backend status
    api.chat.getHistory(id)
      .then((history: any[]) => {
        setBackendOk(true);
        if (history?.length) {
          setMessages(
            history.flatMap((h) => [
              { id: h.chat_id + "-u", role: "user"      as const, content: h.user_message },
              { id: h.chat_id + "-a", role: "assistant" as const, content: h.ai_response, chat_id: h.chat_id, feedback: h.was_helpful },
            ])
          );
        }
      })
      .catch(() => setBackendOk(false));
  }, []);

  // ── Scroll to bottom on new messages ──────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Focus input when opened ────────────────────────────────
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(0);
    }
  }, [open]);

  // ── Send message ──────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const trimmed = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: genId(), role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res: any = await api.chat.send(trimmed, sessionId);
      setBackendOk(true);
      const aiMsg: ChatMessage = {
        id: res.chat_id ?? genId(),
        role: "assistant",
        content: res.ai_response ?? res.message ?? "I'm not sure how to answer that.",
        chat_id: res.chat_id,
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setBackendOk(false);
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          role: "assistant",
          content: "Sorry, I can't connect right now. Please email us at **syntaxsoftwaresolution@gmail.com**.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId, open]);

  // ── Feedback ──────────────────────────────────────────────
  const handleFeedback = async (chatId: string, helpful: boolean) => {
    try {
      await api.chat.feedback(chatId, helpful);
      setMessages((prev) =>
        prev.map((m) => (m.chat_id === chatId ? { ...m, feedback: helpful } : m))
      );
    } catch {}
  };

  // ── Clear chat ────────────────────────────────────────────
  const clearChat = async () => {
    try { await api.chat.clearSession(sessionId); } catch {}
    const newId = genId();
    setSessionId(newId);
    localStorage.setItem(SESSION_KEY, newId);
    setMessages([]);
  };

  // ── Render message content with basic markdown ─────────────
  const renderContent = (content: string) => (
    <div
      className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 [&_strong]:font-semibold [&_a]:text-blue-400 [&_a]:underline"
      dangerouslySetInnerHTML={{
        __html: content
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/`(.*?)`/g, '<code class="bg-black/10 dark:bg-white/10 px-1 rounded text-xs">$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/\n\n/g, "</p><p>")
          .replace(/\n/g, "<br/>"),
      }}
    />
  );

  const welcomeMsg = messages.length === 0;

  return (
    <>
      {/* ── Floating button ─────────────────────────────────── */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.div>
        </AnimatePresence>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}

        {/* Offline indicator */}
        {backendOk === false && !open && (
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white" title="AI offline" />
        )}
      </motion.button>

      {/* ── Chat window ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
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
                <p className="text-[11px] text-blue-200 mt-0.5">
                  {backendOk === false ? "Offline — contact us directly" : "Ask me anything about our services"}
                </p>
              </div>
              <button
                onClick={clearChat}
                className="text-blue-200 hover:text-white transition-colors flex-shrink-0"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            {backendOk === false && messages.length === 0 ? (
              /* Show offline panel only when there's nothing to show */
              <OfflinePanel />
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white dark:bg-slate-900">
                {/* Welcome + quick prompts */}
                {welcomeMsg && (
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
                  </div>
                )}

                {/* Messages */}
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
                    <div className="max-w-[85%] space-y-1">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                        }`}
                      >
                        {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                      </div>

                      {/* Feedback buttons */}
                      {msg.role === "assistant" && msg.chat_id && (msg.feedback === null || msg.feedback === undefined) && (
                        <div className="flex items-center gap-1 pl-1">
                          <span className="text-[10px] text-gray-400">Helpful?</span>
                          <button onClick={() => handleFeedback(msg.chat_id!, true)}  className="text-gray-400 hover:text-emerald-500 transition-colors"><ThumbsUp   className="w-3 h-3" /></button>
                          <button onClick={() => handleFeedback(msg.chat_id!, false)} className="text-gray-400 hover:text-red-500    transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                        </div>
                      )}
                      {msg.role === "assistant" && msg.feedback !== null && msg.feedback !== undefined && (
                        <p className="text-[10px] text-gray-400 pl-1">{msg.feedback ? "👍 Thanks!" : "👎 Sorry about that"}</p>
                      )}
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
            )}

            {/* Input bar — shown even when offline so user can try */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={backendOk === false ? "Backend offline — try anyway…" : "Type a message…"}
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
