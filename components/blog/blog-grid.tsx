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
          // FIX: Handle both string and Date objects
          createdAt={
            typeof post.createdAt === 'string'
              ? post.createdAt // already a string
              : post.createdAt?.toISOString?.() // if it's a Date object
          }
          views={post.views}
          index={index}
        />
      ))}
    </div>
  )
} 

// BlogGridSkeleton.tsx
export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
