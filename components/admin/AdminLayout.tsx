"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Briefcase, FolderKanban, FileText,
  MessageSquare, Users, Mail, BarChart3, LogOut,
  Menu, ChevronRight, Sun, Moon, Code2, Bell, ArrowLeft, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";

const NAV = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/services",     label: "Services",     icon: Briefcase },
  { href: "/admin/portfolio",    label: "Portfolio",    icon: FolderKanban },
  { href: "/admin/blog",         label: "Blog",         icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/developers",   label: "Team",         icon: Users },
  { href: "/admin/messages",     label: "Messages",     icon: Mail, badge: true },
  { href: "/admin/analytics",    label: "Analytics",    icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/admin/messages?limit=50")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.total != null) setUnread(data.total);
        else if (Array.isArray(data?.messages)) setUnread(data.messages.length);
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const stored = localStorage.getItem("syntax-theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("syntax-theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
    toast.success("Logged out");
  };

  const displayName = session?.user?.name || "Admin";
  const displayEmail = session?.user?.email || "";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 flex flex-col
        bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white leading-none">Syntax Admin</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">Control Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
                <div className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"}
                `}>
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge && unread > 0 && (
                    <Badge className="bg-red-500 text-white text-[10px] h-5 min-w-5 px-1.5 rounded-full">
                      {unread > 99 ? "99+" : unread}
                    </Badge>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-2 mb-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full text-xs h-8 gap-2">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white font-medium capitalize">
              {pathname.split("/").at(-1) ?? "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link href="/">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Website</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDark}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Link href="/admin/messages">
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hidden md:flex">
                <ExternalLink className="w-3.5 h-3.5" /> Open Site
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
