"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
  currentCategory: string
}

export function CategoryFilter({ onCategoryChange, currentCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(["All", ...data.data])
        }
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex flex-wrap gap-2 mb-8 fade-in-down">
      {loading ? (
        <div className="h-10 bg-background/50 rounded-md w-40 animate-pulse" />
      ) : (
        categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === (category === "All" ? "all" : category) ? "default" : "outline"}
            onClick={() => onCategoryChange(category === "All" ? "all" : category)}
            className={
              currentCategory === (category === "All" ? "all" : category)
                ? "bg-gradient-to-r from-primary to-secondary border-0"
                : "border-border"
            }
          >
            {category}
          </Button>
        ))
      )}
    </div>
  )
}
 