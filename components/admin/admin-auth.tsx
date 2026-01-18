"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface AdminAuthProps {
  onAuthSuccess: () => void
}

export function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("admin_token", data.token)
        onAuthSuccess()
      } else {
        setError("Invalid password")
      }
    } catch (err) {
      setError("Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="noise-bg min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-6 bg-card border border-border">
        <h1 className="text-3xl font-bold mb-2 glow-text">Admin Access</h1>
        <p className="text-muted-foreground mb-6">Enter the admin password to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="bg-background/50 border-border"
              disabled={loading}
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
