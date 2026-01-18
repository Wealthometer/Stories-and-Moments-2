"use client"

import { useState, useEffect } from "react"
import { UploadForm } from "@/components/admin/upload-form"
import { PostsList } from "@/components/admin/posts-list"
import { AdminAuth } from "@/components/admin/admin-auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      setAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return null
  }

  if (!authenticated) {
    return <AdminAuth onAuthSuccess={() => setAuthenticated(true)} />
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    setAuthenticated(false)
  }

  return (
    <div className="noise-bg min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12 fade-in-down">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog posts and media</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-12 fade-in-up">
          {/* Create Post Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 glow-text">Create New Post</h2>
            <UploadForm />
          </div>

          {/* Posts Management Section */}
          <div className="border-t border-border pt-12">
            <PostsList />
          </div>
        </div>
      </div>
    </div>
  )
}
