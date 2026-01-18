"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EditForm } from "./edit-form"
import { Loader2, Edit2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BlogPost } from "@/lib/types"

export function PostsList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/posts?limit=100")
      const data = await response.json()
      if (data.success) {
        setPosts(data.data.posts)
      }
    } catch (error) {
      toast({ title: "Failed to fetch posts", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Post deleted successfully" })
        fetchPosts()
      } else {
        toast({ title: "Failed to delete post", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error deleting post", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (editingPost) {
    return <EditForm post={editingPost} onClose={() => setEditingPost(null)} onSuccess={fetchPosts} />
  }

  if (posts.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No posts yet. Create your first post above!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 glow-text">Your Posts</h2>
      {posts.map((post) => (
        <Card key={post._id} className="p-4 bg-card border border-border hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1 truncate">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-background/50 px-2 py-1 rounded">{post.category}</span>
                <span className="text-muted-foreground">{post.views} views</span>
                <span className="text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={() => setEditingPost(post)}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                onClick={() => handleDelete(post._id || "")}
                size="sm"
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
