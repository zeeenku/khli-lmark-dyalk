"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
                <Image alt="logo" width={40} height={40} src="./logo.svg" 
                className="w-10 h-10 text-primary-foreground" />
                <div>
                  <h1 className="text-xl font-bold text-primary">Khli l'Mark Dyalk</h1>
                  <h2 className="text-sm font-bold text-muted-foreground">Made by 
                    <span className="text-foreground"> Enafs</span>
                  </h2>
                </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-4">
          {/* Combined Input Area */}
          <Card className="p-6 md:px-16">
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-primary mb-2">Partagi m3ana</h1>
                <p className="text-muted-foreground">Ayi project, khdma, injaz...
                  o contributi m3a <span className="font-semibold text-primary">{posts.length}</span> etudiants akhryn khlaw lmark dylhom
                </p>
              </div>          
              <div className="text-sm text-muted-foreground">
                Anpartagiw kolchi anonymously f page instagram dyalna
              </div>
              
              {/* Input/Form Area */}
              {isRegistered ? (
                <SubmissionForm onSubmit={handleNewPost} />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center overflow-hidden justify-center">
                    <Image alt="logo" width={40} height={40} src="./logo.svg" />
                  </div>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full justify-start bg-muted hover:bg-accent text-muted-foreground hover:text-foreground">
                      We are proud of you...
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Posts Feed */}
          <PostFeed posts={posts} />
        </div>
      </main>
    </div>
  )
}
