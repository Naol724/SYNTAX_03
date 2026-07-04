"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"

interface GalleryItem {
  _id: string
  title: string
  description?: string
  url: string
  category: string
  active: boolean
  order: number
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error("Failed to fetch gallery items:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })
      fetchItems()
    } catch (error) {
      console.error("Failed to toggle active:", error)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" })
      fetchItems()
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage gallery images</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleActive(item._id, item.active)}>
                    {item.active ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteItem(item._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                No images found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
