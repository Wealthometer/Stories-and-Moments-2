"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BlogPost } from "@/lib/types"

const CATEGORIES = ["Travel", "Photography", "Nature", "Culture", "Adventure", "Food", "Urban", "Love", "Life", "Code"]

interface EditFormProps {
  post: BlogPost
  onClose: () => void
  onSuccess: () => void
}

export function EditForm({ post, onClose, onSuccess }: EditFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    story: post.story,
    category: post.category,
    videoUrl: post.videoUrl || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: "Post updated successfully!" })
        onSuccess()
        onClose()
      } else {
        toast({ title: "Failed to update post", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error updating post", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full p-6 bg-card border border-border relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 hover:bg-background/50 rounded-md transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-2xl font-bold mb-6 glow-text">Edit Post</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Post title"
            className="bg-background/50 border-border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description"
            className="bg-background/50 border-border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-background/50 border border-border rounded-md text-foreground"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Story/Content</label>
          <Textarea
            name="story"
            value={formData.story}
            onChange={handleInputChange}
            placeholder="Tell the story behind this image or video..."
            rows={6}
            className="bg-background/50 border-border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video URL (Optional)</label>
          <Input
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            placeholder="YouTube or Vimeo URL"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Post"
            )}
          </Button>
          <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
