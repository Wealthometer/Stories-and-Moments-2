"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, Share2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`)
        const data = await response.json()

        if (data.success) {
          setPost(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch post:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="noise-bg min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 rounded-lg mb-8" />
          <Skeleton className="h-12 rounded-lg mb-4 w-3/4" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="noise-bg min-h-screen bg-background flex items-center justify-center">
        <div className="text-center fade-in-down">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/">
            <Button variant="outline" className="border-border hover:bg-background/50 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const randomAnimation = ["fade-in-up", "slide-in-left", "slide-in-right"][Math.floor(Math.random() * 3)]

  return (
    <div className="noise-bg min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-block mb-8 fade-in-down">
          <Button variant="ghost" className="hover:bg-background/50 text-primary hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Featured Image */}
        <div className={`relative h-96 rounded-lg overflow-hidden mb-8 ${randomAnimation}`}>
          <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Header */}
        <div className={`mb-8 ${randomAnimation}`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-primary/20 text-primary border border-primary/30">{post.category}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views} views
            </span>
          </div>

          <h1 className="text-5xl font-bold glow-text mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground">{post.description}</p>
        </div>

        {/* Video Embed (if available) */}
        {post.videoUrl && (
          <div className={`mb-12 rounded-lg overflow-hidden aspect-video ${randomAnimation}`}>
            <iframe
              src={post.videoUrl
                .replace("youtu.be/", "youtube.com/embed/")
                .replace("youtube.com/watch?v=", "youtube.com/embed/")}
              className="w-full h-full"
              allowFullScreen
              title="Post video"
            />
          </div>
        )}

        {/* Content */}
        <div className={`prose prose-invert max-w-none mb-12 ${randomAnimation}`}>
          <div className="bg-background/50 border border-border rounded-lg p-8">
            <div className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{post.story}</div>
          </div>
        </div>

        {/* Share Button */}
        <div className={`flex gap-4 ${randomAnimation}`}>
          <Button
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.description,
                  url: window.location.href,
                })
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Post
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-border hover:bg-background/50 bg-transparent">
              View More Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
