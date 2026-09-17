"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Eye, Users, FileText, MessageSquare, Briefcase, FolderKanban, Loader2, Mail } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.stats) setStats(data.stats);
        if (data?.dailyData) setDailyData(data.dailyData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const s = stats ?? {};

  const contentData = [
    { name: "Services", value: s.totalServices ?? 0, color: "#3b82f6" },
    { name: "Portfolio", value: s.totalPortfolio ?? 0, color: "#6366f1" },
    { name: "Blog Posts", value: s.totalBlogPosts ?? 0, color: "#8b5cf6" },
    { name: "Testimonials", value: s.totalTestimonials ?? 0, color: "#ec4899" },
    { name: "Messages", value: s.totalContactMessages ?? 0, color: "#10b981" },
    { name: "Leads", value: s.totalLeads ?? 0, color: "#f59e0b" },
  ];

  const statCards = [
    { label: "Total Views", value: (s.totalViews ?? 0).toLocaleString(), icon: Eye, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Unique Visitors", value: (s.uniqueVisitors ?? 0).toLocaleString(), icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    { label: "Blog Posts", value: s.totalBlogPosts ?? 0, icon: FileText, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "Messages", value: s.totalContactMessages ?? 0, icon: Mail, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Services", value: s.totalServices ?? 0, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Portfolio", value: s.totalPortfolio ?? 0, icon: FolderKanban, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    { label: "Testimonials", value: s.totalTestimonials ?? 0, icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
    { label: "Bookings", value: s.totalBookings ?? 0, icon: Users, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Website performance metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border-gray-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm">Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={contentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {contentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm">Daily Traffic (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  fontSize={11}
                />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="pageViews" fill="#3b82f6" name="Page Views" radius={[4, 4, 0, 0]} />
                <Bar dataKey="uniqueVisitors" fill="#10b981" name="Visitors" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
