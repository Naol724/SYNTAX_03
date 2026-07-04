"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Calendar, TrendingUp, DollarSign, Activity } from "lucide-react"

interface DashboardStats {
  totalBookings: number
  totalLeads: number
  totalBlogPosts: number
  totalViews: number
  pendingBookings: number
  newLeads: number
}

interface Booking {
  _id: string
  name: string
  service: string
  status: string
}

interface Lead {
  _id: string
  name: string
  interest: string
  status: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalLeads: 0,
    totalBlogPosts: 0,
    totalViews: 0,
    pendingBookings: 0,
    newLeads: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch("/api/admin/stats")
      const statsData = await statsRes.json()
      if (statsRes.ok && statsData.stats) {
        setStats(statsData.stats)
      }

      const bookingsRes = await fetch("/api/bookings?limit=5")
      const bookingsData = await bookingsRes.json()
      if (bookingsRes.ok && bookingsData.bookings) {
        setRecentBookings(bookingsData.bookings)
      }

      const leadsRes = await fetch("/api/leads?limit=5")
      const leadsData = await leadsRes.json()
      if (leadsRes.ok && leadsData.leads) {
        setRecentLeads(leadsData.leads)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
      change: stats.pendingBookings > 0 ? `${stats.pendingBookings} pending` : "All cleared",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      color: "bg-green-500",
      change: stats.newLeads > 0 ? `${stats.newLeads} new` : "No new leads",
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogPosts,
      icon: FileText,
      color: "bg-purple-500",
      change: `Active blog content`,
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Activity,
      color: "bg-orange-500",
      change: "Views across all posts",
    },
  ]

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading dashboard...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{booking.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    booking.status === "confirmed" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent bookings</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lead.interest}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    lead.status === "converted"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : lead.status === "lost"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent leads</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
