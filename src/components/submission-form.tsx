"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { addPost, getCurrentUserId } from "@/lib/storage"
import { Sparkles } from "lucide-react"

interface SubmissionFormProps {
  onSubmit: () => void
}

export function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    const userId = getCurrentUserId()
    if (userId) {
      addPost(content, userId)
      setContent("")
      onSubmit()
    }
    setIsSubmitting(false)
  }

  return (
    <Card className="overflow-hidden shadow-md">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <Textarea
            id="submission"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-12 resize-none text-[15px] border-0 bg-muted rounded-full px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
            maxLength={500}
          />
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{content.length}/500</span>
          </div>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
