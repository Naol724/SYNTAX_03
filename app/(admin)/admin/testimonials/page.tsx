"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Star } from "lucide-react"
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

interface Testimonial {
  _id: string
  name: string
  company?: string
  content: string
  rating: number
  image?: string
  active: boolean
  featured: boolean
  order: number
}

const emptyForm = {
  name: "",
  company: "",
  content: "",
  rating: 5,
  image: "",
  active: true,
  featured: false,
  order: 0,
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [isOpen, setIsOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingTestimonial(null)
    setFormData(emptyForm)
    setIsOpen(true)
  }

  const handleOpenEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      company: testimonial.company || "",
      content: testimonial.content,
      rating: testimonial.rating || 5,
      image: testimonial.image || "",
      active: testimonial.active,
      featured: testimonial.featured,
      order: testimonial.order || 0,
    })
    setIsOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    const method = editingTestimonial ? "PATCH" : "POST"
    const url = editingTestimonial ? `/api/testimonials/${editingTestimonial._id}` : "/api/testimonials"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsOpen(false)
        fetchTestimonials()
      } else {
        const err = await response.json()
        alert(err.error || "Failed to save testimonial")
      }
    } catch (error) {
      console.error("Failed to save testimonial:", error)
      alert("Something went wrong.")
    } finally {
      setFormLoading(false)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })
      fetchTestimonials()
    } catch (error) {
      console.error("Failed to toggle active:", error)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      })
      fetchTestimonials()
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
      fetchTestimonials()
    } catch (error) {
      console.error("Failed to delete testimonial:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage client reviews</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    {testimonial.company && (
                      <span className="text-sm text-gray-500">at {testimonial.company}</span>
                    )}
                    <Badge className={testimonial.active ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"}>
                      {testimonial.active ? "Active" : "Hidden"}
                    </Badge>
                    {testimonial.featured && (
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 italic max-w-3xl">
                    "{testimonial.content}"
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Order: {testimonial.order}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(testimonial._id, testimonial.active)}>
                    {testimonial.active ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleFeatured(testimonial._id, testimonial.featured)}>
                    {testimonial.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(testimonial)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteTestimonial(testimonial._id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No testimonials found
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
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Abebe Kebede"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company / Association</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Ethio Tech Solutions"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5 Stars)</Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
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
              <Label htmlFor="image">Client Avatar URL (Optional)</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="e.g. /images/testimonials/avatar1.jpg"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Review Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Write client's feedback..."
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
                Featured Review
              </label>
            </div>

            <DialogFooter className="pt-4 border-t dark:border-gray-700">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : "Save Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
