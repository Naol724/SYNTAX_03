"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Service {
  _id: string
  name: string
  description: string
  icon?: string
  price?: string
  category: string
  active: boolean
  featured: boolean
  order: number
}

const emptyForm = {
  name: "",
  description: "",
  icon: "🌐",
  price: "",
  category: "Web",
  active: true,
  featured: false,
  order: 0,
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog State
  const [isOpen, setIsOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingService(null)
    setFormData(emptyForm)
    setIsOpen(true)
  }

  const handleOpenEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      icon: service.icon || "🌐",
      price: service.price || "",
      category: service.category || "Web",
      active: service.active,
      featured: service.featured,
      order: service.order || 0,
    })
    setIsOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    const method = editingService ? "PATCH" : "POST"
    const url = editingService ? `/api/services/${editingService._id}` : "/api/services"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsOpen(false)
        fetchServices()
      } else {
        const err = await response.json()
        alert(err.error || "Failed to save service")
      }
    } catch (error) {
      console.error("Failed to save service:", error)
      alert("Something went wrong.")
    } finally {
      setFormLoading(false)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })
      fetchServices()
    } catch (error) {
      console.error("Failed to toggle active:", error)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      })
      fetchServices()
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" })
      fetchServices()
    } catch (error) {
      console.error("Failed to delete service:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage service offerings</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{service.icon}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <Badge className={service.active ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"}>
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                    {service.featured && (
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-3xl">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>Category: {service.category}</span>
                    {service.price && <span>Price: {service.price}</span>}
                    <span>Order: {service.order}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(service._id, service.active)}>
                    {service.active ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleFeatured(service._id, service.featured)}>
                    {service.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteService(service._id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No services found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Website Development"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="AI">AI</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji / Character)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. 🌐"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price Label</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. Starting at $500"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Describe the service details..."
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Active (Visible to public)
              </label>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Featured
              </label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
