import { connectToDatabase } from "@/lib/mongoose"
import { BlogPost, Comment } from "@/lib/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Share2, Facebook, Twitter, Linkedin, ArrowLeft, Clock } from "lucide-react"
import { notFound } from "next/navigation"

async function getBlogPost(slug: string) {
  try {
    await connectToDatabase()

    const post = await BlogPost.findOne({ slug, published: true })
    if (!post) return null

    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      published: true,
      $or: [
        { category: post.category },
        { tags: { $in: post.tags } },
      ],
    })
      .limit(4)
      .sort({ createdAt: -1 })

    const comments = await Comment.find({
      postId: post._id,
      approved: true,
    }).sort({ createdAt: -1 })

    return { post, relatedPosts, comments }
  } catch (error) {
    console.error("Failed to load blog post:", error)
    return null
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const data = await getBlogPost(params.slug)

  if (!data) {
    notFound()
  }

  const { post, relatedPosts, comments } = data

  return (
    <div className="min-h-screen bg-transparent py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg mb-8">
          {post.featuredImage && (
            <div className="relative h-64 md:h-96 bg-gray-200 dark:bg-gray-700">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              {post.category && (
                <Badge variant="outline">{post.category}</Badge>
              )}
              {post.featured && (
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.views} views</span>
              </div>
            </div>
            {post.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {post.excerpt}
              </p>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Share */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Share this article</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Facebook className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline">
                <Twitter className="w-4 h-4 mr-2" />
                Tweet
              </Button>
              <Button size="sm" variant="outline">
                <Linkedin className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Comment Form */}
            <form className="space-y-4 mb-8">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea id="comment" placeholder="Share your thoughts..." rows={4} />
              </div>
              <Button type="submit">Post Comment</Button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {comment.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost._id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  {relatedPost.featuredImage && (
                    <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">{relatedPost.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
