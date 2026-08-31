"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FolderKanban, FileText, MessageSquare, Users, Mail, Eye, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { motion } from "framer-motion";

interface Stats {
  totalServices: number;
  totalPortfolio: number;
  totalBlogs: number;
  totalTestimonials: number;
  totalDevelopers: number;
  totalMessages: number;
  unreadMessages: number;
  urgentMessages: number;
  totalUsers: number;
  totalViews: number;
  recentActivity: { activity_type: string; activity_id: string; title: string; created_at: string }[];
}

const STAT_CARDS = (s: Stats) => [
  { label: "Services",     value: s.totalServices,   icon: Briefcase,     color: "from-blue-500 to-blue-600",    href: "/admin/services" },
  { label: "Portfolio",    value: s.totalPortfolio,  icon: FolderKanban,  color: "from-indigo-500 to-indigo-600",href: "/admin/portfolio" },
  { label: "Blog Posts",   value: s.totalBlogs,      icon: FileText,      color: "from-violet-500 to-violet-600",href: "/admin/blog" },
  { label: "Testimonials", value: s.totalTestimonials,icon: MessageSquare,color: "from-purple-500 to-purple-600",href: "/admin/testimonials" },
  { label: "Team Members", value: s.totalDevelopers, icon: Users,         color: "from-pink-500 to-pink-600",    href: "/admin/developers" },
  { label: "Total Views",  value: s.totalViews,      icon: Eye,           color: "from-cyan-500 to-cyan-600",    href: "/admin/analytics" },
  { label: "Messages",     value: s.totalMessages,   icon: Mail,          color: "from-emerald-500 to-emerald-600",href: "/admin/messages",
    badge: s.unreadMessages > 0 ? `${s.unreadMessages} unread` : undefined },
  { label: "Registered Users", value: s.totalUsers,  icon: Users,         color: "from-orange-500 to-orange-600",href: "#" },
];

const TYPE_ICON: Record<string, string> = { blog: "📝", portfolio: "🖼️", message: "📩" };
const TYPE_COLOR: Record<string, string> = { blog: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", portfolio: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", message: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.getStats().then((d: any) => setStats(d)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  const s = stats!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Overview of your website content and activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS(s).map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link href={card.href}>
              <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-gray-200 dark:border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                      <card.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    {card.badge && (
                      <Badge variant="secondary" className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5">{card.badge}</Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{card.label}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {s.recentActivity?.length > 0 ? s.recentActivity.map((item) => (
              <div key={item.activity_id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className="text-base mt-0.5">{TYPE_ICON[item.activity_type] ?? "📌"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TYPE_COLOR[item.activity_type]}`}>
                      {item.activity_type}
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-6">No recent activity yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Blog Post",   href: "/admin/blog",         icon: FileText,      color: "border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/20" },
                { label: "Add Portfolio",   href: "/admin/portfolio",    icon: FolderKanban,  color: "border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" },
                { label: "Add Service",     href: "/admin/services",     icon: Briefcase,     color: "border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20" },
                { label: "View Messages",   href: "/admin/messages",     icon: Mail,          color: "border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
                { label: "Add Testimonial", href: "/admin/testimonials", icon: MessageSquare, color: "border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20" },
                { label: "Add Team Member", href: "/admin/developers",   icon: Users,         color: "border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20" },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl border bg-white dark:bg-slate-900 transition-colors cursor-pointer ${action.color}`}>
                    <action.icon className="w-4 h-4 text-gray-600 dark:text-slate-300 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent messages alert */}
      {s.urgentMessages > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            {s.urgentMessages} urgent message{s.urgentMessages > 1 ? "s" : ""} require attention.
          </p>
          <Link href="/admin/messages?priority=urgent" className="ml-auto text-xs font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
            View →
          </Link>
        </motion.div>
      )}
    </div>
  );
}
