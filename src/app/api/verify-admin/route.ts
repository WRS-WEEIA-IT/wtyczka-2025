import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple rate limiting with IP tracking
const attempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5 // Max attempts per IP
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes in milliseconds
const TOKEN_EXPIRY = 30 * 60 * 1000 // 30 minutes in milliseconds

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip'

    // Check if the IP is currently locked out
    const ipAttempts = attempts.get(ip)
    if (ipAttempts && ipAttempts.count >= MAX_ATTEMPTS) {
      const timeElapsed = Date.now() - ipAttempts.lastAttempt

      if (timeElapsed < LOCKOUT_TIME) {
        const remainingSeconds = Math.ceil((LOCKOUT_TIME - timeElapsed) / 1000)
        return NextResponse.json(
          {
            ok: false,
            error: `Zbyt wiele prób! Spróbuj ponownie za ${Math.ceil(remainingSeconds / 60)} minut.`,
          },
          { status: 429 },
        )
      } else {
        // Reset attempts after lockout period
        attempts.delete(ip)
      }
    }

    const body = await request.json().catch(() => ({}))
    const { password } = body as { password?: string }

    const expected = process.env.PAYMENT_FORM_PASSWORD
    if (!expected) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Server misconfiguration: PAYMENT_FORM_PASSWORD is not set.',
        },
        { status: 500 },
      )
    }

    if (!password) {
      return NextResponse.json(
        { ok: false, error: 'Missing password' },
        { status: 400 },
      )
    }

    // First, check if the payment date has been reached
    // This is to determine if we should allow access at all
    // Payment date check removed as it's not being used

    // Check the password (case insensitive)
    if (password.toLowerCase() === expected.toLowerCase()) {
      // Reset attempts on success
      attempts.delete(ip)

      // Generate a secure auth token
      const token = crypto.randomBytes(32).toString('hex')

      // Create response with token in cookie and info about date check
      // Always authorize if the password is correct, regardless of the date
      const response = NextResponse.json(
        {
          ok: true,
          dateReached: true, // Always allow access with correct password
        },
        { status: 200 },
      )

      // Add the secure cookie
      response.cookies.set('admin-auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: TOKEN_EXPIRY / 1000, // Convert to seconds
        path: '/',
      })

      return response
    }

    // Increment failed attempts
    incrementAttempts(ip)

    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    )
  } catch (error) {
    console.error('Error verifying admin password:', error)
    return NextResponse.json(
      { ok: false, error: 'Unexpected server error' },
      { status: 500 },
    )
  }
}

// Helper function to track failed attempts
function incrementAttempts(ip: string) {
  const now = Date.now()
  const current = attempts.get(ip)

  if (current) {
    attempts.set(ip, {
      count: current.count + 1,
      lastAttempt: now,
    })
  } else {
    attempts.set(ip, { count: 1, lastAttempt: now })
  }
}
