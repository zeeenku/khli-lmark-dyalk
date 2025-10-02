"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SubmissionForm } from "@/components/submission-form"
import { PostFeed } from "@/components/post-feed"
import { ThemeToggle } from "@/components/theme-toggle"
import { getCurrentUser, getPosts, logout, type Post, type User } from "@/lib/auth"
import { LogOut } from "lucide-react"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [postsData, userData] = await Promise.all([
        getPosts(),
        getCurrentUser()
      ])
      setPosts(postsData)
      setUser(userData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPost = () => {
    loadData()
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      loadData()
    } catch (error) {
      console.error('Error logging out:', error)
    }
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
              <Image alt="logo" width={40} height={40} src="./logo.svg" 
              className="w-10 h-10 text-primary-foreground" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary">Khli l'Mark Dyalk</h1>
                <h2 className="text-xs md:text-sm font-bold text-muted-foreground">Made by 
                  <span className="text-foreground"> Enafs</span>
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-10 h-10 hover:bg-accent/50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-4">
          {/* Combined Input Area */}
        <Card className="p-6 md:p-10 rounded-2xl shadow-sm border border-border bg-gradient-to-b from-background to-muted/40">
          <div className="space-y-6 text-center md:text-left">
            {/* Heading */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-2">
                Partagi m3ana <span className="bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">Ayi Project, Khadma, Injaz... dertih</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Kima <span className="font-semibold text-primary">{posts.length}</span> étudiants akhryn khlaw lmark dyalhom 🌟
              </p>
            </div>

            {/* Alert / Info Box */}
            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary font-medium">
              📢 Anpartagiw kolchi <span className="underline decoration-dotted">anonymously</span> f page Instagram dyalna  
            </div>

            {/* Input/Form Area */}
            {user ? (
              <SubmissionForm onSubmit={handleNewPost} />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/90 rounded-full flex items-center justify-center overflow-hidden shadow-md">
                  <Image alt="logo" width={36} height={36} src="./logo.svg" />
                </div>
                <Link href="/auth" className="flex-1">
                  <Button className="w-full justify-start bg-gradient-to-r from-muted to-accent/20 hover:from-accent/30 hover:to-muted text-muted-foreground hover:text-foreground transition-all rounded-xl">
                    We are proud of you... 💙
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>


          {/* Posts Feed */}
          <PostFeed posts={posts} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}
