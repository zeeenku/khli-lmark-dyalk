"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SubmissionForm } from "@/components/submission-form"
import { PostFeed } from "@/components/post-feed"
import { ThemeToggle } from "@/components/theme-toggle"
import { getPosts, isUserRegistered, type Post } from "@/lib/storage"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isRegistered, setIsRegistered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPosts(getPosts())
    setIsRegistered(isUserRegistered())
  }, [])

  const handleNewPost = () => {
    setPosts(getPosts())
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-primary">Be Proud</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-4">
          {/* Input Area */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              {isRegistered ? (
                <Button 
                  className="flex-1 justify-start bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const form = document.getElementById('submission-form')
                    if (form) {
                      form.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  Leave your mark...
                </Button>
              ) : (
                <Link href="/register" className="flex-1">
                  <Button className="w-full justify-start bg-muted hover:bg-accent text-muted-foreground hover:text-foreground">
                    Join the community! Register to share your achievements, projects, and thoughts anonymously
                  </Button>
                </Link>
              )}
            </div>
          </Card>

          {/* Post Form - Only for logged in users */}
          {isRegistered && (
            <div id="submission-form">
              <SubmissionForm onSubmit={handleNewPost} />
            </div>
          )}

          {/* Posts Feed */}
          <PostFeed posts={posts} />
        </div>
      </main>
    </div>
  )
}
