"use client"
import { BlogCard } from "./blog-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { BlogPost } from "@/lib/types"

interface BlogGridProps {
  initialPosts: BlogPost[]
  total: number
  currentPage: number
  totalPages: number
}

export function BlogGrid({ initialPosts, total, currentPage, totalPages }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialPosts.map((post, index) => (
        <BlogCard
          key={post._id || `post-${index}`}
          _id={post._id || ""}
          title={post.title}
          description={post.description}
          imageUrl={post.imageUrl}
          category={post.category}
          createdAt={post.createdAt.toISOString()} // Convert Date to string
          views={post.views}
          index={index}
        />
      ))}
    </div>
  )
}

export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-lg" />
      ))}
    </div>
  )
}