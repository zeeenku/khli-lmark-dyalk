export interface User {
  id: string
  name: string
  phone: string
  registeredAt: string
}

export interface Post {
  id: string
  content: string
  anonymousName: string
  createdAt: string
  userId: string
}

const USERS_KEY = "anonymous_users"
const POSTS_KEY = "anonymous_posts"
const SESSION_KEY = "current_user_id"

const ANONYMOUS_NAMES = [
  "Anonymous Panda",
  "Silent Owl",
  "Quiet Fox",
  "Hidden Bear",
  "Secret Deer",
  "Mystery Wolf",
  "Unknown Rabbit",
  "Nameless Eagle",
  "Faceless Tiger",
  "Invisible Lion",
  "Phantom Hawk",
  "Shadow Lynx",
]

export function getRandomAnonymousName(): string {
  return ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)]
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function addUser(name: string, phone: string): User {
  const users = getUsers()
  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    phone,
    registeredAt: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return newUser
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(SESSION_KEY)
}

export function setCurrentUserId(userId: string): void {
  sessionStorage.setItem(SESSION_KEY, userId)
}

export function isUserRegistered(): boolean {
  return getCurrentUserId() !== null
}

export function getPosts(): Post[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(POSTS_KEY)
  return data ? JSON.parse(data) : []
}

export function addPost(content: string, userId: string): Post {
  const posts = getPosts()
  const newPost: Post = {
    id: crypto.randomUUID(),
    content,
    anonymousName: getRandomAnonymousName(),
    createdAt: new Date().toISOString(),
    userId,
  }
  posts.unshift(newPost)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return newPost
}
