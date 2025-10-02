"use client"

import { Card } from "@/components/ui/card"
import type { Post } from "@/lib/auth"
import { generateAvatarColor, getInitials, getTimeAgo } from "@/lib/avatar-generator"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleReaction, getCurrentUser, getUserLikedPosts } from "@/lib/auth"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface PostFeedProps {
  posts: Post[]
  isLoading?: boolean
}

export function PostFeed({ posts, isLoading = false }: PostFeedProps) {
  const [postLikes, setPostLikes] = useState<Record<string, number>>({})
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({})
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const router = useRouter()

  // Check if user is logged in and load liked posts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser()
        setIsLoggedIn(!!user)
        
        if (user) {
          const liked = await getUserLikedPosts()
          setLikedPosts(liked)
          // Initialize user likes state
          const likesState: Record<string, boolean> = {}
          liked.forEach(postId => {
            likesState[postId] = true
          })
          setUserLikes(likesState)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
    loadUserData()
  }, [])

  if (isLoading) {
    return (
      <Card className="p-16 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="p-16 text-center border-2 border-dashed">
        <div className="text-6xl mb-4">✨</div>
        <p className="text-lg font-medium mb-2">No posts yet!</p>
        <p className="text-muted-foreground">Be the first to share something amazing</p>
      </Card>
    )
  }

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      router.push('/auth')
      return
    }

    try {
      // Optimistic update
      const currentLikes = postLikes[postId] ?? posts.find(p => p.id === postId)?.likes ?? 0
      const currentLiked = userLikes[postId] ?? false
      
      // Update UI immediately
      setPostLikes(prev => ({ 
        ...prev, 
        [postId]: currentLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1 
      }))
      setUserLikes(prev => ({ 
        ...prev, 
        [postId]: !currentLiked 
      }))

      // Make API call
      const result = await toggleReaction(postId)
      
      // Update with actual result from server
      setPostLikes(prev => ({ ...prev, [postId]: result.likes }))
      setUserLikes(prev => ({ ...prev, [postId]: result.liked }))
    } catch (error) {
      console.error('Error toggling reaction:', error)
      // Revert optimistic update on error
      const post = posts.find(p => p.id === postId)
      if (post) {
        setPostLikes(prev => ({ ...prev, [postId]: post.likes }))
        setUserLikes(prev => ({ ...prev, [postId]: false }))
      }
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const avatarColor = generateAvatarColor(post.anonymousName)
        const initials = getInitials(post.anonymousName)
        const timeAgo = getTimeAgo(new Date(post.createdAt))
        const likes = postLikes[post.id] ?? post.likes
        const isLiked = userLikes[post.id] ?? false

        return (
          <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
            {/* Post Header */}
            <div className="p-5 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center shadow-lg ring-2 ring-primary/10`}>
                <span className="text-white font-bold text-lg">{initials}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-lg text-foreground">{post.anonymousName}</p>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{timeAgo}</p>
              </div>
              <div className="text-primary/60 text-2xl">⋯</div>
            </div>

            {/* Post Content */}
            <div className="px-5 pb-5">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-foreground leading-relaxed text-[16px] font-medium">{post.content}</p>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="border-t border-border/50 px-3 py-3 bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={`w-full hover:bg-primary/10 transition-all duration-200 rounded-xl h-12 ${
                  isLiked 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Heart className={`w-5 h-5 transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
                    <span className="font-semibold text-sm">
                      {isLiked ? 'Liked' : 'Like this post'}
                    </span>
                  </div>
                  
                  {likes > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {Array.from({ length: Math.min(likes, 3) }).map((_, i) => (
                          <div key={i} className="w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                            <span className="text-xs text-primary-foreground">👍</span>
                          </div>
                        ))}
                        {likes > 3 && (
                          <div className="w-5 h-5 bg-muted rounded-full border-2 border-card flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">+{likes - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {likes} {likes === 1 ? 'like' : 'likes'}
                      </span>
                    </div>
                  )}
                </div>
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
