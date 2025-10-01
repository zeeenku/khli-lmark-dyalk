"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { addUser, setCurrentUserId } from "@/lib/storage"
import { ArrowLeft, Sparkles, Shield, Zap } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    setIsSubmitting(true)
    const user = addUser(name, phone)
    setCurrentUserId(user.id)
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg mb-2">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary">
            Join Be Proud
          </h1>
          <p className="text-muted-foreground text-lg text-balance">Share your achievements, projects, and thoughts anonymously</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center border-2">
            <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs font-medium">100% Anonymous</p>
          </Card>
          <Card className="p-3 text-center border-2">
            <Zap className="w-5 h-5 mx-auto mb-1 text-secondary" />
            <p className="text-xs font-medium">Instant Posts</p>
          </Card>
          <Card className="p-3 text-center border-2">
            <Sparkles className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="text-xs font-medium">No Judgment</p>
          </Card>
        </div>

        <Card className="p-6 shadow-xl border-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                Full Name
                <span className="text-xs text-muted-foreground font-normal">(kept private)</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 focus:border-primary transition-colors h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                Phone Number
                <span className="text-xs text-muted-foreground font-normal">(kept private)</span>
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-2 focus:border-primary transition-colors h-11"
                required
              />
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                {isSubmitting ? "Creating your account..." : "Get Started 🚀"}
              </Button>

              <Link href="/" className="block">
                <Button type="button" variant="ghost" className="w-full hover:bg-accent/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Feed
                </Button>
              </Link>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground text-balance">
                Your info stays on your device. Posts are 100% anonymous with random usernames.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
