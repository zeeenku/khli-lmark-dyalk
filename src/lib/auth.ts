'use client'

export interface User {
  id: string
  name: string
  phone: string
  username: string
}

export interface Post {
  id: string
  content: string
  userId: string
  anonymousName: string
  createdAt: string
  likes: number
}

// Auth functions
export async function register(name: string, phone: string) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, phone }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }

  return data
}

export async function login(phone: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }

  return data
}

export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Logout failed')
  }

  return data
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me')
    const data = await response.json()
    
    if (!response.ok) {
      return null
    }

    return data.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Post functions
export async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch('/api/posts')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch posts')
    }

    return data.posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function createPost(content: string): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create post')
  }

  return data.post
}

export async function toggleReaction(postId: string): Promise<{ liked: boolean; likes: number }> {
  const response = await fetch(`/api/posts/${postId}/reactions`, {
    method: 'POST',
  })

  // Check if response is HTML (404 page)
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('text/html')) {
    console.error('API returned HTML instead of JSON. Response:', await response.text())
    throw new Error('API endpoint not found')
  }

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to toggle reaction')
  }

  return { liked: data.liked, likes: data.likes }
}

export async function getUserLikedPosts(): Promise<string[]> {
  try {
    const response = await fetch('/api/user/liked-posts')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch liked posts')
    }

    return data.likedPosts
  } catch (error) {
    console.error('Error fetching liked posts:', error)
    return []
  }
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // If it starts with 212, add + prefix
  if (digits.startsWith('212')) {
    return '+' + digits
  }
  
  // If it's 9 digits, add +212 prefix
  if (digits.length === 9) {
    return '+212' + digits
  }
  
  // If it's 10 digits and starts with 0, remove 0 and add +212
  if (digits.length === 10 && digits.startsWith('0')) {
    return '+212' + digits.substring(1)
  }
  
  return phone
}

export function validatePhoneNumber(phone: string): boolean {
  // Must be +212 followed by exactly 9 digits
  const phoneRegex = /^\+212\d{9}$/
  return phoneRegex.test(phone)
}
