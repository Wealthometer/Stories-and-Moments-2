"use client"

import { UploadForm } from "@/components/admin/upload-form"

export default function AdminPage() {
  return (
    <div className="noise-bg min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 fade-in-down">
          <h1 className="text-4xl font-bold glow-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog posts and media</p>
        </div>

        <div className="fade-in-up">
          <UploadForm />
        </div>
      </div>
    </div>
  )
}
