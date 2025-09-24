import { NextResponse } from 'next/server'
import { getDateFromDatabase } from '../../../../lib/supabase'

export async function GET() {
  try {
    // Get the date from database
    const contactDateStr = await getDateFromDatabase('CONTACT_DATE')

    if (!contactDateStr) {
      // If no date is set, allow access by default
      return NextResponse.json({ ok: true, access: true })
    }

    const now = new Date()
    const contactDate = new Date(contactDateStr)

    // Return information with date in ISO format for consistent handling
    if (now >= contactDate) {
      // Access granted
      return NextResponse.json({
        ok: true,
        access: true,
        date: contactDateStr,
        isOpen: true,
        message: 'Contact page is available',
      })
    } else {
      // Access denied - but we'll return a 200 status code with access: false
      // This way the frontend can display a proper placeholder but middleware will
      // still block access to the actual content
      const timeRemaining = contactDate.getTime() - now.getTime()
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

      return NextResponse.json({
        ok: true,
        access: false,
        date: contactDateStr,
        isOpen: false,
        daysRemaining: daysRemaining,
        message: 'Kadra zostanie ujawniona wkrótce',
      })
    }
  } catch (error) {
    console.error('Error checking contacts access:', error)
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    )
  }
}
