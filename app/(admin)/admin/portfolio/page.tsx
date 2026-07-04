"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
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

interface Project {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  thumbnail?: string
  client?: string
  technologies: string[]
  projectUrl?: string
  githubUrl?: string
  featured: boolean
  active: boolean
  order: number
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  category: "Web",
  thumbnail: "",
  client: "",
  technologiesString: "Next.js, Tailwind CSS, MongoDB",
  projectUrl: "",
  githubUrl: "",
  active: true,
  featured: false,
  order: 0,
}

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [isOpen, setIsOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/portfolio")
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    
    setFormData({
      ...formData,
      title,
      slug,
    })
  }

  const handleOpenAdd = () => {
    setEditingProject(null)
    setFormData(emptyForm)
    setIsOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      category: project.category || "Web",
      thumbnail: project.thumbnail || "",
      client: project.client || "",
      technologiesString: project.technologies?.join(", ") || "",
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      active: project.active,
      featured: project.featured,
      order: project.order || 0,
    })
    setIsOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    const technologies = formData.technologiesString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0)

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      thumbnail: formData.thumbnail,
      client: formData.client,
      technologies,
      projectUrl: formData.projectUrl,
      githubUrl: formData.githubUrl,
      active: formData.active,
      featured: formData.featured,
      order: formData.order,
    }

    const method = editingProject ? "PATCH" : "POST"
    const url = editingProject ? `/api/portfolio/${editingProject._id}` : "/api/portfolio"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsOpen(false)
        fetchProjects()
      } else {
        const err = await response.json()
        alert(err.error || "Failed to save project")
      }
    } catch (error) {
      console.error("Failed to save project:", error)
      alert("Something went wrong.")
    } finally {
      setFormLoading(false)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/portfolio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })
      fetchProjects()
    } catch (error) {
      console.error("Failed to toggle active:", error)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await fetch(`/api/portfolio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      })
      fetchProjects()
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
      fetchProjects()
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage portfolio projects</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded bg-gray-100 dark:bg-gray-800"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-400">
                      📁
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <Badge className={project.active ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"}>
                        {project.active ? "Active" : "Hidden"}
                      </Badge>
                      {project.featured && (
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-500">Category: {project.category}</span>
                      {project.client && <span className="text-xs text-gray-500">Client: {project.client}</span>}
                      <div className="flex gap-1">
                        {project.technologies?.slice(0, 3).map((tech: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] py-0 border-gray-200 dark:border-gray-700 text-gray-500">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies?.length > 3 && (
                          <span className="text-[10px] text-gray-400">+{project.technologies.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(project._id, project.active)}>
                    {project.active ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleFeatured(project._id, project.featured)}>
                    {project.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteProject(project._id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No projects found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Portfolio Project" : "Add Portfolio Project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. E-Commerce App"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (Auto-generated)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="e.g. ecommerce-app"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="e.g. Addis Eats"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologiesString">Technologies (Comma-separated)</Label>
                <Input
                  id="technologiesString"
                  value={formData.technologiesString}
                  onChange={(e) => setFormData({ ...formData, technologiesString: e.target.value })}
                  placeholder="e.g. Next.js, React Native, Tailwind CSS"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="e.g. /images/portfolio/project1.jpg"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectUrl">Live Link (Project URL)</Label>
                <Input
                  id="projectUrl"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  placeholder="e.g. https://addiseats.com"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository Link</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="e.g. https://github.com/syntax/addis-eats"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Explain the project scope and client solutions..."
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
                Featured Project
              </label>
            </div>

            <DialogFooter className="pt-4 border-t dark:border-gray-700">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : "Save Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
