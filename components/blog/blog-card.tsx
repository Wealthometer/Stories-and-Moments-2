"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"

interface BlogCardProps {
  _id: string
  title: string
  description: string
  imageUrl: string
  category: string
  createdAt: string
  views: number
  index?: number
}

const animations = ["fade-in-up", "slide-in-left", "slide-in-right", "scale-in"]

export function BlogCard({ _id, title, description, imageUrl, category, createdAt, views, index = 0 }: BlogCardProps) {
  const animation = animations[index % animations.length]
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Link href={`/blog/${_id}`}>
      <Card className={`group overflow-hidden bg-card border border-border card-hover cursor-pointer ${animation}`}>
        <div className="relative h-48 overflow-hidden bg-background/50">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-primary/20 text-primary border border-primary/30">{category}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" /> {views}
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>

          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </div>
        </div>
      </Card>
    </Link>
  )
}
