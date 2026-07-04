"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, RefreshCw } from "lucide-react"

interface ContentItem {
  _id: string
  section: string
  key: string
  value: any
  type: string
  description: string
}

export default function AdminContent() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState("hero")
  const [editing, setEditing] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content")
      const data = await response.json()
      setContent(data.content || [])
    } catch (error) {
      console.error("Failed to fetch content:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (id: string, value: any) => {
    try {
      await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      })
      fetchContent()
    } catch (error) {
      console.error("Failed to update content:", error)
    }
  }

  const sections = ["hero", "about", "services", "contact", "footer"]
  const filteredContent = content.filter(c => c.section === selectedSection)

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage website content</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Edit Content</CardTitle>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {filteredContent.map((item) => (
              <div key={item._id} className="space-y-2">
                <Label>{item.key}</Label>
                {item.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                )}
                {item.type === "text" && (
                  <Input
                    value={editing[item._id] !== undefined ? editing[item._id] : item.value}
                    onChange={(e) => setEditing({ ...editing, [item._id]: e.target.value })}
                  />
                )}
                {item.type === "textarea" && (
                  <Textarea
                    value={editing[item._id] !== undefined ? editing[item._id] : item.value}
                    onChange={(e) => setEditing({ ...editing, [item._id]: e.target.value })}
                    rows={4}
                  />
                )}
                {item.type === "number" && (
                  <Input
                    type="number"
                    value={editing[item._id] !== undefined ? editing[item._id] : item.value}
                    onChange={(e) => setEditing({ ...editing, [item._id]: parseFloat(e.target.value) })}
                  />
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    updateContent(item._id, editing[item._id] !== undefined ? editing[item._id] : item.value)
                    setEditing({ ...editing, [item._id]: undefined })
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            ))}
            {filteredContent.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No content found for this section
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
