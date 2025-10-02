import { NextResponse } from 'next/server'
import { getUserLikedPosts } from '@/lib/database'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const likedPosts = getUserLikedPosts(userId)

    return NextResponse.json({
      success: true,
      likedPosts
    })
  } catch (error) {
    console.error('Get liked posts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
