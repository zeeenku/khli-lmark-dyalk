"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { generateAvatarColor, getInitials, getTimeAgo } from "@/lib/avatar-generator"
import type { Post } from "@/lib/auth"

interface PostCardProps {
  post: Post
  isLiked: boolean
  likes: number
  onLike: (postId: string) => void
  isLoggedIn: boolean
}

export function PostCard({ post, isLiked, likes, onLike, isLoggedIn }: PostCardProps) {
  const avatarColor = generateAvatarColor(post.anonymousName)
  const initials = getInitials(post.anonymousName)
  const timeAgo = getTimeAgo(new Date(post.createdAt))

  const handleLike = () => {
    onLike(post.id)
  }

  return (
    <Card className="pb-0 overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/60 hover:border-primary/30 bg-gradient-to-br from-card to-muted/40 rounded-2xl">
      {/* Post Header */}
      <div className="px-5 flex items-center gap-4">
        {/* Avatar Circle */}
        <div>
          <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full ${avatarColor} flex items-center justify-center shadow-md ring-2 ring-primary/10`}>
            <span className="text-white font-bold md:text-lg">{initials}</span>
          </div>
        </div>
        {/* Name + Meta */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold  md:text-lg text-foreground">{post.anonymousName}</p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">{timeAgo}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-8">
          <p className="text-foreground leading-relaxed text-[15px] md:text-[16px] font-medium">
            {post.content}
          </p>
      </div>

      {/* Engagement Bar */}
      <div className="border-t border-border/50 overflow_hidden bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`w-full hover:bg-primary/10 px-5 rounded-none transition-all duration-200 h-12 ${
            isLiked
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {/* Left: Like Icon + Text */}
            <div className="flex items-center gap-3">
              <Heart
                className={`w-5 h-5 transition-transform duration-200 ${
                  isLiked ? 'fill-current scale-110 text-primary' : 'hover:scale-110'
                }`}
              />
              <span className="font-semibold text-sm">
                {isLiked ? 'Liked' : 'Like this post'}
              </span>
            </div>

            {/* Right: Likes Counter */}
            {likes > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(likes, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center"
                    >
                      <span className="text-xs text-primary-foreground">👍</span>
                    </div>
                  ))}
                  {likes > 3 && (
                    <div className="w-5 h-5 bg-muted rounded-full border-2 border-card flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">
                        +{likes - 3}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium text-muted-foreground">
                  {likes} {likes === 1 ? 'like' : 'likes'}
                </span>
              </div>
            )}
          </div>
        </Button>
      </div>
    </Card>
  )
}
