"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { createPost } from "@/lib/auth"
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
    try {
      await createPost(content.trim())
      setContent("")
      onSubmit()
    } catch (error) {
      console.error('Error creating post:', error)
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
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
        >
          {isSubmitting ? "🎉 Posting..." : "🎉 Partager"}
        </Button>
      </div>
    </form>
  )
}
