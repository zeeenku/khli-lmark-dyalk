"use client"

import { Card } from "@/components/ui/card"
import type { Post } from "@/lib/storage"
import { generateAvatarColor, getInitials, getTimeAgo } from "@/lib/avatar-generator"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostFeedProps {
  posts: Post[]
}

export function PostFeed({ posts }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <Card className="p-16 text-center border-2 border-dashed">
        <div className="text-6xl mb-4">✨</div>
        <p className="text-lg font-medium mb-2">No posts yet!</p>
        <p className="text-muted-foreground">Be the first to share something amazing</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const avatarColor = generateAvatarColor(post.anonymousName)
        const initials = getInitials(post.anonymousName)
        const timeAgo = getTimeAgo(new Date(post.createdAt))

        return (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center shadow-md`}>
                <span className="text-white font-bold text-sm">{initials}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">{post.anonymousName}</p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <span className="text-lg">⋯</span>
              </Button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-4">
              <p className="text-foreground leading-relaxed text-[15px]">{post.content}</p>
            </div>

            {/* Engagement Stats */}
            <div className="px-4 pb-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>👍 12 likes</span>
                  <span>💬 3 comments</span>
                </div>
                <span>2 shares</span>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="border-t border-border px-2 py-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:bg-accent/50 text-muted-foreground hover:text-primary transition-colors rounded-lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Like</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:bg-accent/50 text-muted-foreground hover:text-primary transition-colors rounded-lg"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Comment</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:bg-accent/50 text-muted-foreground hover:text-primary transition-colors rounded-lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Share</span>
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
