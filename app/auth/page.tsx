"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { register, login, formatPhoneNumber, validatePhoneNumber, getPosts, getCurrentUser } from "@/lib/auth"
import { ArrowLeft, Sparkles, Shield, Zap } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [postsCount, setPostsCount] = useState(0)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          // toast.success("rk deja msjl m3ana!")
          router.push("/")
          return
        }
      } catch (error) {
        // User not logged in, continue normally
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuthStatus()
  }, [])

  // Load posts count on component mount
  useEffect(() => {
    const loadPostsCount = async () => {
      try {
        const posts = await getPosts()
        setPostsCount(new Set(posts.map(p => p.userId)).size)
      } catch (error) {
        console.error('Error loading posts count:', error)
      }
    }
    loadPostsCount()
  }, [])

  // Phone change is now handled directly in the input onChange

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone number are required")
      return
    }

    if (!validatePhoneNumber(phone)) {
      setError("Phone number must be in format +212XXXXXXXXX (9 digits after +212)")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Try to login first
      try {
        await login(phone)
        toast.success("Welcome back! 👋")
        router.push("/")
        return
      } catch (loginError) {
        // If login fails, try to register
        try {
          await register(name.trim(), phone)
          toast.success("Mr7ba biiiiik! 🎉")
          router.push("/")
          return
        } catch (registerError) {
          // If both fail, show error
          const errorMessage = registerError instanceof Error ? registerError.message : "Authentication failed"
          setError(errorMessage)
          toast.error(errorMessage)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
              <Image alt="logo" width={64} height={64} src="./logo.svg" className="mx-auto" />
          <h1 className="text-4xl font-bold text-primary">
            Khli L'Mark dyalk
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Partagi m3ana ayi project, khdma, injaz drtih... anonymously kima  
            <span className="font-bold text-primary"> {postsCount} </span> 
            <Link href="/" className="underline" >etudiants akhryn</Link>
          </p>
          
        </div>
        <Card className="p-6 shadow-xl border-2">
          <div className="bg-primary/20 p-2 rounded-md">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground w-full">
                Your info stays on your device. Posts are 100% anonymous with random usernames.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                Full Name
                <span className="text-xs text-muted-foreground font-normal"></span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Zakariaa Zeenku"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 focus:border-primary transition-colors h-11"
                required
              />
            </div>

             <div className="space-y-2">
               <label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                 Phone Number
                 <span className="text-xs text-muted-foreground font-normal"></span>
               </label>
               <div className="flex border-2 border-input rounded-md focus-within:border-primary transition-colors">
                 <div className="flex items-center px-3 bg-muted border-r border-input text-sm font-medium text-muted-foreground">
                   +212
                 </div>
                 <input
                   id="phone"
                   type="tel"
                   placeholder="XXXXXXXXX"
                   value={phone.replace('+212', '')}
                   onChange={(e) => {
                     const value = e.target.value.replace(/\D/g, '') // Only digits
                     if (value.length <= 9) {
                       setPhone('+212' + value)
                     }
                   }}
                   className="flex-1 px-3 py-2 bg-transparent border-0 focus:outline-none h-11"
                   maxLength={9}
                   required
                 />
               </div>
               <p className="text-xs text-muted-foreground">
                 Enter 9 digits after(e.g.,  +212612345678)
               </p>
             </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                {isSubmitting ? "Signing in..." : "Let's gooo"}
              </Button>

              <div className="text-start ps-4">
                <li className="text-xs text-muted-foreground">
                  We'll automatically sign you in if you have an account, or create a new one if you don't.
                </li>
                <li className="text-xs text-muted-foreground">
                  We might contact you later to check if you are interested to join our club
                </li>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
