"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Building2, MoreVertical } from "lucide-react"

interface Lead {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  interest: string
  source: string
  message?: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  createdAt: string
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads")
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error("Failed to fetch leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchLeads()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contacted":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      case "qualified":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      case "converted":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      case "lost":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      default:
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage potential customer leads</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {lead.name}
                    </h3>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {lead.company}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Interest: {lead.interest}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Source: {lead.source}
                  </p>
                  {lead.message && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">
                      "{lead.message}"
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No leads found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
