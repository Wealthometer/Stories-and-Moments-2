"use client";

import { useState, useEffect } from "react";
import { BlogGrid, BlogGridSkeleton } from "@/components/blog/blog-grid";
import { CategoryFilter } from "@/components/blog/category-filter";
import type { BlogPost } from "@/lib/types";

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1 });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
          ...(category !== "all" && { category }),
        });

        const response = await fetch(`/api/posts?${query}`);
        const data = await response.json();

        if (data.success) {
          setPosts(data.data.posts);
          setPagination(data.data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, category]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/noise.jpg')" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 fade-in-down">
          <h1 className="text-5xl font-bold glow-text mb-3 text-amber-50">
            Stories & Moments
          </h1>
          <p className="text-lg text-muted-foreground text-white">
            Explore beautiful stories captured in images and videos
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          onCategoryChange={handleCategoryChange}
          currentCategory={category}
        />

        {/* Blog Grid - Fixed with all required props */}
        {loading ? (
          <BlogGridSkeleton />
        ) : (
          <BlogGrid
            initialPosts={posts}
            total={pagination.total}
            currentPage={pagination.page}
            totalPages={pagination.pages}
          />
        )}

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
  );
}
