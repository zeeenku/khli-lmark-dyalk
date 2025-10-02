"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { createPost } from "@/lib/auth"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

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
    try {
      await createPost(content.trim())
      setContent("")
      toast.success("Post shared successfully! 🎉")
      onSubmit()
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center overflow-hidden justify-center">
          <Image alt="logo" width={40} height={40} src="./logo.svg" />
        </div>
        <Textarea
          id="submission"
          placeholder="We are proud of you... 💙"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 min-h-10 resize-none text-[15px] border-0 bg-muted rounded-full px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
          maxLength={500}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{content.length}/500</span>
        </div>
        <div className="relative group">
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 disabled:opacity-50"
          >
            {isSubmitting ? "🎉 Posting..." : "🎉 Partager"}
          </Button>
          {!content.trim() && !isSubmitting && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-3 py-2 rounded-md shadow-lg border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Write something to share...
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
