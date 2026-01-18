"use client"

import { useState, useEffect } from "react"
import { BlogGrid, BlogGridSkeleton } from "@/components/blog/blog-grid"
import { CategoryFilter } from "@/components/blog/category-filter"
import type { BlogPost } from "@/lib/types"

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState("all")
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1 })

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
          ...(category !== "all" && { category }),
        })

        const response = await fetch(`/api/posts?${query}`)
        const data = await response.json()

        if (data.success) {
          setPosts(data.data.posts)
          setPagination(data.data.pagination)
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage, category])

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    setCurrentPage(1)
  }

  return (
    <div className="noise-bg min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 fade-in-down">
          <h1 className="text-5xl font-bold glow-text mb-3">Stories & Moments</h1>
          <p className="text-lg text-muted-foreground">Explore beautiful stories captured in images and videos</p>
        </div>

        {/* Category Filter */}
        <CategoryFilter onCategoryChange={handleCategoryChange} currentCategory={category} />

        {/* Blog Grid */}
        {loading ? <BlogGridSkeleton /> : <BlogGrid {...pagination} initialPosts={posts} />}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="mt-12 flex justify-center fade-in-up">
            <div className="flex gap-2">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-primary to-secondary text-foreground"
                      : "bg-background/50 border border-border hover:border-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
