import { NextResponse } from 'next/server'
import { getDateFromDatabase } from '../../../../lib/supabase'

export async function GET(request: Request) {
  try {
    // Get the date from database instead of environment variables
    const paymentDateStr = await getDateFromDatabase('PAYMENT_OPEN_DATE')

    // Check for admin cookie
    const cookieHeader = request.headers.get('cookie') || ''
    const adminCookie = cookieHeader.includes('admin-auth=')

    if (!paymentDateStr) {
      // If no date is set, deny access by default
      return NextResponse.json({
        ok: true,
        access: false,
        isAdmin: adminCookie,
        message:
          'Formularz płatności niedostępny - data otwarcia nie została określona',
      })
    }

    const now = new Date()
    const paymentDate = new Date(paymentDateStr)

    // Convert dates to timestamps for reliable comparison
    const nowTimestamp = now.getTime()
    const paymentTimestamp = paymentDate.getTime()

    // Determine if access should be granted based only on date
    // Admin cookie is not considered here - we'll handle password protection separately
    const isDatePassed = nowTimestamp >= paymentTimestamp
    const hasAccess = isDatePassed || adminCookie

    // For debugging
    console.log(`Current date: ${now.toISOString()}`)
    console.log(`Payment date: ${paymentDate.toISOString()}`)
    console.log(`Is date passed: ${isDatePassed}`)
    console.log(`Has admin cookie: ${adminCookie}`)
    console.log(`Access granted: ${hasAccess}`)

    if (hasAccess) {
      // Access granted
      return NextResponse.json({
        ok: true,
        access: true,
        date: paymentDateStr,
        isOpen: isDatePassed,
        isAdmin: adminCookie,
        message:
          adminCookie && !isDatePassed
            ? 'Admin access granted'
            : 'Payment is available',
      })
    } else {
      // Access denied - but return 200 status so frontend can show placeholder
      const timeRemaining = paymentDate.getTime() - now.getTime()
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

      return NextResponse.json({
        ok: true,
        access: false,
        date: paymentDateStr,
        isOpen: false,
        daysRemaining: daysRemaining,
        message: 'Formularz płatności niedostępny',
      })
    }
  } catch (error) {
    console.error('Error checking payment access:', error)
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    )
  }
}
