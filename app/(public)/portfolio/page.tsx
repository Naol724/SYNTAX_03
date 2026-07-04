"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbox } from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { ExternalLink, Github, Filter } from "lucide-react"
import Link from "next/link"

interface Project {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  images: string[]
  thumbnail: string
  client: string
  technologies: string[]
  projectUrl?: string
  githubUrl?: string
  featured: boolean
  active: boolean
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory, projects])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/public/portfolio")
      const data = await response.json()
      setProjects(data.projects || [])
      setFilteredProjects(data.projects || [])
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...Array.from(new Set(projects.map(p => p.category)))]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Our Portfolio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our latest projects and see how we bring ideas to life
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg">
            <Filter className="w-5 h-5 text-gray-400 ml-2" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 border-0 focus:ring-0">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  <div 
                    className="relative h-48 bg-gray-200 dark:bg-gray-700 cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={project.thumbnail || project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold">View Gallery</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.projectUrl && (
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live
                          </Link>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            Code
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No projects found in this category.</p>
          </div>
        )}

        {/* Lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={filteredProjects.map(p => ({ src: p.images[0] || p.thumbnail }))}
          index={lightboxIndex}
        />
      </div>
    </div>
  )
}
