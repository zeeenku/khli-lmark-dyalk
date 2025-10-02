import { NextRequest, NextResponse } from 'next/server'
import { getUserByPhone, validatePhoneNumber, formatPhoneNumber } from '@/lib/database'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phone)
    
    if (!validatePhoneNumber(formattedPhone)) {
      return NextResponse.json(
        { error: 'Phone number must be in format +212XXXXXXXXX (9 digits after +212)' },
        { status: 400 }
      )
    }

    // Find user
    const user = getUserByPhone(formattedPhone)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please register first.' },
        { status: 404 }
      )
    }

    // Set cookie
    const cookieStore = cookies()
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
