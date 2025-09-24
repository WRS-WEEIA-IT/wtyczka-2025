import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDateFromDatabase } from './lib/supabase'

// This middleware will protect data API routes while allowing access to pages
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // We only want to protect API routes that fetch data, not the pages themselves
  // This allows the frontend to render placeholder content

  // Protect team members API data
  if (path.includes('/api/team-members') || path.includes('/api/data/team')) {
    const contactOpenDate = await getDateFromDatabase('CONTACT_DATE')
    if (contactOpenDate) {
      const now = new Date()
      const openDate = new Date(contactOpenDate)

      if (now < openDate) {
        // Block access to the team members data
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }
  }

  // Protect payment data and form submissions
  if (path.includes('/api/payments') || path.includes('/api/data/payment')) {
    const paymentOpenDate = await getDateFromDatabase('PAYMENT_OPEN_DATE')
    if (paymentOpenDate) {
      const now = new Date()
      const openDate = new Date(paymentOpenDate)

      // Check if the payment date is reached or if user has admin auth
      const adminAuthCookie = request.cookies.get('admin-auth')

      // If the date is not reached and user doesn't have admin auth
      if (now < openDate && !adminAuthCookie) {
        // Block access to payment data
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }
  }

  // Continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on all API routes
export const config = {
  matcher: [
    '/api/:path*',
    '/api/team-members/:path*',
    '/api/payments/:path*',
    '/api/data/:path*',
  ],
}

// Note: The middleware is intentionally NOT applied to the page routes themselves,
// only to the API routes. This allows the pages to load and show placeholder content,
// while preventing the actual data from being accessed until the dates are reached.
