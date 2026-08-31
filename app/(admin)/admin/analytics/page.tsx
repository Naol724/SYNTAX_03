"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Eye, Users, FileText, MessageSquare, Briefcase, FolderKanban, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.getStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
  );

  const s = stats ?? {};

  const contentData = [
    { name: "Services", value: s.totalServices ?? 0, color: "#3b82f6" },
    { name: "Portfolio", value: s.totalPortfolio ?? 0, color: "#6366f1" },
    { name: "Blog Posts", value: s.totalBlogs ?? 0, color: "#8b5cf6" },
    { name: "Testimonials", value: s.totalTestimonials ?? 0, color: "#ec4899" },
    { name: "Team", value: s.totalDevelopers ?? 0, color: "#f59e0b" },
    { name: "Users", value: s.totalUsers ?? 0, color: "#10b981" },
  ];

  const messageData = [
    { name: "Unread", value: s.unreadMessages ?? 0, color: "#3b82f6" },
    { name: "Read", value: (s.totalMessages ?? 0) - (s.unreadMessages ?? 0) - (s.urgentMessages ?? 0), color: "#6b7280" },
    { name: "Urgent", value: s.urgentMessages ?? 0, color: "#ef4444" },
  ];

  const statCards = [
    { label: "Total Views", value: (s.totalViews ?? 0).toLocaleString(), icon: Eye, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Registered Users", value: s.totalUsers ?? 0, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    { label: "Blog Posts", value: s.totalBlogs ?? 0, icon: FileText, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "Total Messages", value: s.totalMessages ?? 0, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Services", value: s.totalServices ?? 0, icon: Briefcase, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { label: "Portfolio Items", value: s.totalPortfolio ?? 0, icon: FolderKanban, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Website performance and content overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((c) => (
          <Card key={c.label} className="border-gray-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content distribution bar chart */}
        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={contentData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--card-foreground)", fontSize: 12 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {contentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Messages pie chart */}
        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Message Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={messageData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                  {messageData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--card-foreground)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 flex-1">
              {messageData.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-gray-600 dark:text-slate-400 flex-1">{item.name}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity timeline */}
      {s.recentActivity?.length > 0 && (
        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {s.recentActivity.slice(0, 8).map((item: any) => (
                <div key={item.activity_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-400 capitalize">{item.activity_type}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
