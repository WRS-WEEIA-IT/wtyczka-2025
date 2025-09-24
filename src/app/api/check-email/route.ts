import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Try to trigger password reset to check if email exists
    // This doesn't actually send email in most cases, just checks if user exists
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    })

    // If no error, user likely exists
    // If error contains "User not found" or similar, user doesn't exist
    if (error) {
      if (
        error.message.includes('User not found') ||
        error.message.includes('Unable to validate email') ||
        error.message.includes('user_not_found')
      ) {
        return NextResponse.json({ exists: false })
      } else {
        // Other errors might indicate rate limiting or config issues
        // In this case, we'll assume user doesn't exist to allow registration attempt
        return NextResponse.json({ exists: false })
      }
    }

    // No error means user exists
    return NextResponse.json({ exists: true })
  } catch (error) {
    console.error('Email check error:', error)
    // If check fails, allow registration attempt
    return NextResponse.json({ exists: false })
  }
}
