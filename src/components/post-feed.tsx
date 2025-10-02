"use client"

import { Card } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/auth"
import { toggleReaction, getCurrentUser, getUserLikedPosts } from "@/lib/auth"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PostFeedProps {
  posts: Post[]
  isLoading?: boolean
  onClearState?: () => void
}

export function PostFeed({ posts, isLoading = false, onClearState }: PostFeedProps) {
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
      
      // Show toast notification
      if (result.liked) {
        toast.success("Post liked! 👍")
      } else {
        toast.success("Like removed")
      }
    } catch (error) {
      console.error('Error toggling reaction:', error)
      toast.error("Failed to update like")
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
        const likes = postLikes[post.id] ?? post.likes
        const isLiked = userLikes[post.id] ?? false

        return (
          <PostCard
            key={post.id}
            post={post}
            isLiked={isLiked}
            likes={likes}
            onLike={handleLike}
            isLoggedIn={isLoggedIn ?? false}
          />
        )
      })}
    </div>
  )
}
