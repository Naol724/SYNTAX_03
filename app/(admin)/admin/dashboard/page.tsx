"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase, FolderKanban, FileText, MessageSquare, Users, Mail, Eye, TrendingUp, Clock,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Stats {
  totalServices: number;
  totalPortfolio: number;
  totalBlogPosts: number;
  totalTestimonials: number;
  totalContactMessages: number;
  totalViews: number;
  totalBookings: number;
  totalLeads: number;
  pendingBookings: number;
  newLeads: number;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
}

const STAT_CARDS = (s: Stats) => [
  { label: "Services", value: s.totalServices, icon: Briefcase, color: "from-blue-500 to-blue-600", href: "/admin/services" },
  { label: "Portfolio", value: s.totalPortfolio, icon: FolderKanban, color: "from-indigo-500 to-indigo-600", href: "/admin/portfolio" },
  { label: "Blog Posts", value: s.totalBlogPosts, icon: FileText, color: "from-violet-500 to-violet-600", href: "/admin/blog" },
  { label: "Testimonials", value: s.totalTestimonials, icon: MessageSquare, color: "from-purple-500 to-purple-600", href: "/admin/testimonials" },
  { label: "Bookings", value: s.totalBookings, icon: Users, color: "from-pink-500 to-pink-600", href: "/admin/bookings" },
  { label: "Total Views", value: s.totalViews, icon: Eye, color: "from-cyan-500 to-cyan-600", href: "/admin/analytics" },
  {
    label: "Messages",
    value: s.totalContactMessages,
    icon: Mail,
    color: "from-emerald-500 to-emerald-600",
    href: "/admin/messages",
    badge: s.totalContactMessages > 0 ? `${s.totalContactMessages} total` : undefined,
  },
  { label: "Leads", value: s.totalLeads, icon: Users, color: "from-orange-500 to-orange-600", href: "/admin/leads" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/messages?limit=5"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({
            totalServices: statsData.stats?.totalServices ?? 0,
            totalPortfolio: statsData.stats?.totalPortfolio ?? 0,
            totalBlogPosts: statsData.stats?.totalBlogPosts ?? 0,
            totalTestimonials: statsData.stats?.totalTestimonials ?? 0,
            totalContactMessages: statsData.stats?.totalContactMessages ?? 0,
            totalViews: statsData.stats?.totalViews ?? 0,
            totalBookings: statsData.stats?.totalBookings ?? 0,
            totalLeads: statsData.stats?.totalLeads ?? 0,
            pendingBookings: statsData.stats?.pendingBookings ?? 0,
            newLeads: statsData.stats?.newLeads ?? 0,
          });
        }

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setRecentMessages(messagesData.messages ?? []);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const s: Stats = stats ?? {
    totalServices: 0,
    totalPortfolio: 0,
    totalBlogPosts: 0,
    totalTestimonials: 0,
    totalContactMessages: 0,
    totalViews: 0,
    totalBookings: 0,
    totalLeads: 0,
    pendingBookings: 0,
    newLeads: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          Overview of your website content and activity
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS(s).map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={card.href}>
              <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-gray-200 dark:border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                      <card.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    {card.badge && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5"
                      >
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{card.label}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Recent Contact Messages
              </CardTitle>
              <Link href="/admin/messages" className="text-xs text-blue-600 hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentMessages.length > 0 ? (
              recentMessages.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-base mt-0.5">📩</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                      {item.name} — {item.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400 dark:text-slate-500 truncate">
                        {item.email}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-slate-500">
                        {new Date(item.receivedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-6">
                No contact messages yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Blog Post", href: "/admin/blog", icon: FileText, color: "border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/20" },
                { label: "Add Portfolio", href: "/admin/portfolio", icon: FolderKanban, color: "border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" },
                { label: "Add Service", href: "/admin/services", icon: Briefcase, color: "border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20" },
                { label: "View Messages", href: "/admin/messages", icon: Mail, color: "border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
                { label: "Add Testimonial", href: "/admin/testimonials", icon: MessageSquare, color: "border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20" },
                { label: "Analytics", href: "/admin/analytics", icon: Eye, color: "border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20" },
              ].map((action) => (
                <Link key={action.href + action.label} href={action.href}>
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
    </div>
  );
}
