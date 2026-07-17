import { connectToDatabase } from "@/lib/mongoose"
import { BlogPost } from "@/lib/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight, Search } from "lucide-react"

async function getBlogPosts(searchParams: { search?: string; category?: string; page?: string }) {
  try {
    await connectToDatabase()

    const page = parseInt(searchParams.page || "1")
    const limit = 12

    const query: any = { published: true }
    if (searchParams.search) {
      query.$or = [
        { title: { $regex: searchParams.search, $options: "i" } },
        { excerpt: { $regex: searchParams.search, $options: "i" } },
      ]
    }
    if (searchParams.category) {
      query.category = searchParams.category
    }

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await BlogPost.countDocuments(query)

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    // Return sample data if database connection fails
    const samplePosts = [
      {
        _id: "1",
        title: "Getting Started with Next.js 15",
        slug: "getting-started-with-nextjs-15",
        excerpt: "Learn the new features and improvements in Next.js 15 including the new App Router and Server Components.",
        content: "<p>Next.js 15 brings exciting new features...</p>",
        featuredImage: "",
        category: "Development",
        tags: ["Next.js", "React", "Web Development"],
        author: "Syntax Team",
        published: true,
        featured: true,
        views: 0,
        createdAt: new Date(),
      },
      {
        _id: "2",
        title: "Building Scalable APIs with Node.js",
        slug: "building-scalable-apis-with-nodejs",
        excerpt: "Best practices for building production-ready APIs that can handle millions of requests.",
        content: "<p>Building scalable APIs requires careful planning...</p>",
        featuredImage: "",
        category: "Development",
        tags: ["Node.js", "API", "Backend"],
        author: "Syntax Team",
        published: true,
        featured: false,
        views: 0,
        createdAt: new Date(),
      },
      {
        _id: "3",
        title: "The Future of AI in Software Development",
        slug: "future-of-ai-in-software-development",
        excerpt: "How AI is transforming the way we write code and build software applications.",
        content: "<p>AI is revolutionizing software development...</p>",
        featuredImage: "",
        category: "Technology",
        tags: ["AI", "Machine Learning", "Future"],
        author: "Syntax Team",
        published: true,
        featured: true,
        views: 0,
        createdAt: new Date(),
      },
    ]

    return {
      posts: samplePosts,
      pagination: {
        page: 1,
        limit: 12,
        total: 3,
        pages: 1,
      },
    }
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; page?: string }
}) {
  const { posts, pagination } = await getBlogPosts(searchParams)

  return (
    <div className="min-h-screen bg-transparent py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and updates from our team
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              defaultValue={searchParams.search}
            />
          </div>
          <Select defaultValue={searchParams.category}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Tutorial">Tutorial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <Card key={post._id} className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              {post.featuredImage && (
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {post.category && (
                    <Badge variant="outline">{post.category}</Badge>
                  )}
                  {post.featured && (
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <Button
                key={i}
                variant={i + 1 === pagination.page ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link
                  href={{
                    pathname: "/blog",
                    query: {
                      ...searchParams,
                      page: (i + 1).toString(),
                    },
                  }}
                >
                  {i + 1}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
