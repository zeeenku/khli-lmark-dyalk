import fs from 'fs'
import path from 'path'
import { generateUsername } from 'unique-username-generator'
import { randomUUID } from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const POSTS_FILE = path.join(DATA_DIR, 'posts.json')
const REACTIONS_FILE = path.join(DATA_DIR, 'reactions.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize with dummy data if files don't exist
function initializeDummyData() {
  if (!fs.existsSync(USERS_FILE)) {
    const dummyUser: User = {
      id: 'dummy-user-1',
      name: 'Anonymous User',
      phone: '+212612345678',
      username: generateUsername('', 2),
      createdAt: new Date().toISOString()
    }
    writeJsonFile(USERS_FILE, [dummyUser])
  }

  if (!fs.existsSync(POSTS_FILE)) {
    const dummyUser = getUserById('dummy-user-1')
    const dummyPosts: Post[] = [
      {
        id: 'dummy-post-1',
        content: 'I played professional football at 15yo, It was the best days of my life',
        userId: 'dummy-user-1',
        anonymousName: dummyUser?.username || generateUsername('', 2),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        likes: 12
      },
      {
        id: 'dummy-post-2',
        content: 'I made a small stickers business to support myself',
        userId: 'dummy-user-1',
        anonymousName: dummyUser?.username || generateUsername('', 2),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        likes: 8
      },
      {
        id: 'dummy-post-3',
        content: 'I won an AI hackathon',
        userId: 'dummy-user-1',
        anonymousName: dummyUser?.username || generateUsername('', 2),
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        likes: 15
      }
    ]
    writeJsonFile(POSTS_FILE, dummyPosts)
  }

  if (!fs.existsSync(REACTIONS_FILE)) {
    writeJsonFile(REACTIONS_FILE, [])
  }
}

// Initialize dummy data
initializeDummyData()

export interface User {
  id: string
  name: string
  phone: string
  username: string
  createdAt: string
}

export interface Post {
  id: string
  content: string
  userId: string
  anonymousName: string
  createdAt: string
  likes: number
}

export interface Reaction {
  id: string
  postId: string
  userId: string
  type: 'like'
  createdAt: string
}

// Helper functions to read/write JSON files
function readJsonFile<T>(filePath: string): T[] {
  try {
    if (!fs.existsSync(filePath)) {
      return []
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
  }
}

// User operations
export function getUsers(): User[] {
  return readJsonFile<User>(USERS_FILE)
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find(user => user.id === id) || null
}

export function getUserByPhone(phone: string): User | null {
  const users = getUsers()
  return users.find(user => user.phone === phone) || null
}

export function createUser(name: string, phone: string): User {
  const users = getUsers()
  const newUser: User = {
    id: randomUUID(),
    name,
    phone,
    username: generateUsername('', 2),
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  writeJsonFile(USERS_FILE, users)
  return newUser
}

// Post operations
export function getPosts(): Post[] {
  return readJsonFile<Post>(POSTS_FILE)
}

export function getPostById(id: string): Post | null {
  const posts = getPosts()
  return posts.find(post => post.id === id) || null
}

export function createPost(content: string, userId: string): Post {
  const posts = getPosts()
  const user = getUserById(userId)
  const anonymousName = user?.username || generateUsername('', 2)
  const newPost: Post = {
    id: randomUUID(),
    content,
    userId,
    anonymousName,
    createdAt: new Date().toISOString(),
    likes: 0
  }
  posts.unshift(newPost) // Add to beginning
  writeJsonFile(POSTS_FILE, posts)
  return newPost
}

// Reaction operations
export function getReactions(): Reaction[] {
  return readJsonFile<Reaction>(REACTIONS_FILE)
}

export function getUserReaction(postId: string, userId: string): Reaction | null {
  const reactions = getReactions()
  return reactions.find(reaction => 
    reaction.postId === postId && reaction.userId === userId
  ) || null
}

export function toggleReaction(postId: string, userId: string): { liked: boolean; likes: number } {
  const reactions = getReactions()
  const existingReaction = getUserReaction(postId, userId)
  
  if (existingReaction) {
    // Remove reaction
    const updatedReactions = reactions.filter(r => r.id !== existingReaction.id)
    writeJsonFile(REACTIONS_FILE, updatedReactions)
    
    // Update post likes count
    const posts = getPosts()
    const postIndex = posts.findIndex(p => p.id === postId)
    if (postIndex !== -1) {
      posts[postIndex].likes = Math.max(0, posts[postIndex].likes - 1)
      writeJsonFile(POSTS_FILE, posts)
    }
    
    return { liked: false, likes: posts[postIndex]?.likes || 0 }
  } else {
    // Add reaction
    const newReaction: Reaction = {
      id: randomUUID(),
      postId,
      userId,
      type: 'like',
      createdAt: new Date().toISOString()
    }
    reactions.push(newReaction)
    writeJsonFile(REACTIONS_FILE, reactions)
    
    // Update post likes count
    const posts = getPosts()
    const postIndex = posts.findIndex(p => p.id === postId)
    if (postIndex !== -1) {
      posts[postIndex].likes += 1
      writeJsonFile(POSTS_FILE, posts)
    }
    
    return { liked: true, likes: posts[postIndex]?.likes || 0 }
  }
}

export function getUserLikedPosts(userId: string): string[] {
  const reactions = getReactions()
  return reactions
    .filter(reaction => reaction.userId === userId && reaction.type === 'like')
    .map(reaction => reaction.postId)
}

// Phone number validation
export function validatePhoneNumber(phone: string): boolean {
  // Must be +212 followed by exactly 9 digits
  const phoneRegex = /^\+212\d{9}$/
  return phoneRegex.test(phone)
}

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
