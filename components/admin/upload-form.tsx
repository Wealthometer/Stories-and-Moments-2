"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const CATEGORIES = ["Travel", "Photography", "Nature", "Culture", "Adventure", "Food", "Urban", "Love", "Life", "Code"]

export function UploadForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    story: "",
    category: "Travel",
    imageUrl: "",
    videoUrl: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataWithFile = new FormData()
    formDataWithFile.append("file", file)

    try {
      setLoading(true)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataWithFile,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, imageUrl: data.url }))
        toast({ title: "Image uploaded successfully" })
      }
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.imageUrl || !formData.story) {
      toast({ title: "Please fill all required fields", variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: "Post created successfully!" })
        setFormData({
          title: "",
          description: "",
          story: "",
          category: "Travel",
          imageUrl: "",
          videoUrl: "",
        })
      } else {
        toast({ title: "Failed to create post", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error creating post", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl p-6 bg-card border border-border">
      <h2 className="text-2xl font-bold mb-6 glow-text">Create New Post</h2>

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
          <label className="block text-sm font-medium mb-2">Featured Image</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              className="bg-background/50 border-border"
            />
            {formData.imageUrl && <span className="text-sm text-primary">✓ Image selected</span>}
          </div>
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Publish Post
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}
