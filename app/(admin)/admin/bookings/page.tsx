"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, Mail, MoreVertical, Check, X, Clock } from "lucide-react"

interface Booking {
  _id: string
  name: string
  email: string
  phone: string
  service: string
  preferredDate: string
  preferredTime: string
  message?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchBookings()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      case "completed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      case "cancelled":
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage service booking requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {booking.name}
                    </h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {booking.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {booking.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Service: {booking.service}
                  </p>
                  {booking.message && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">
                      "{booking.message}"
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(booking._id, "confirmed")}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(booking._id, "cancelled")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No bookings found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
