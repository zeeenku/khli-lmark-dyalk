import { NextRequest, NextResponse } from 'next/server'
import { toggleReaction, getPostById } from '@/lib/database'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: postId } = params
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const post = getPostById(postId)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const result = toggleReaction(postId, userId)

    return NextResponse.json({
      success: true,
      liked: result.liked,
      likes: result.likes
    })
  } catch (error) {
    console.error('Toggle reaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
