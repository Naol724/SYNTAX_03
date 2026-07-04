"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
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

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  category: string
  author: string
  tags: string[]
  published: boolean
  featured: boolean
  views: number
  createdAt: string
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "Development",
  author: "Syntax Team",
  tagsString: "Next.js, Web Development",
  published: false,
  featured: false,
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog state
  const [isOpen, setIsOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Failed to fetch posts:", error)
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
    setEditingPost(null)
    setFormData(emptyForm)
    setIsOpen(true)
  }

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      featuredImage: post.featuredImage || "",
      category: post.category || "Development",
      author: post.author || "Syntax Team",
      tagsString: post.tags?.join(", ") || "",
      published: post.published,
      featured: post.featured,
    })
    setIsOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    const tags = formData.tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const payload = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: formData.featuredImage,
      category: formData.category,
      author: formData.author,
      tags,
      published: formData.published,
      featured: formData.featured,
    }

    const method = editingPost ? "PATCH" : "POST"
    const url = editingPost ? `/api/blog/${editingPost._id}` : "/api/blog"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsOpen(false)
        fetchPosts()
      } else {
        const err = await response.json()
        alert(err.error || "Failed to save blog post")
      }
    } catch (error) {
      console.error("Failed to save post:", error)
      alert("Something went wrong.")
    } finally {
      setFormLoading(false)
    }
  }

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await fetch(`/api/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      })
      fetchPosts()
    } catch (error) {
      console.error("Failed to toggle published:", error)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await fetch(`/api/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      })
      fetchPosts()
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return
    try {
      await fetch(`/api/blog/${id}`, { method: "DELETE" })
      fetchPosts()
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-400">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage blog posts</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <Badge className={post.published ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                    {post.featured && (
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 max-w-3xl">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Category: {post.category}</span>
                    <span>Author: {post.author}</span>
                    <span>Views: {post.views}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => togglePublished(post._id, post.published)}>
                    {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleFeatured(post._id, post.featured)}>
                    {post.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deletePost(post._id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No posts found
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
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Next.js 15 Routing Patterns"
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
                  placeholder="e.g. nextjs-15-routing-patterns"
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
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagsString">Tags (Comma-separated)</Label>
                <Input
                  id="tagsString"
                  value={formData.tagsString}
                  onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                  placeholder="React, Next.js, Routing"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="e.g. /images/blog/my-post.jpg"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt / Summary</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A short snippet that describes the post..."
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Post Content (HTML Supported)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Write your article content here..."
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono"
                rows={8}
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Publish Immediately
              </label>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Feature this post
              </label>
            </div>

            <DialogFooter className="pt-4 border-t dark:border-gray-700">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : "Save Post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
