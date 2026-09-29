import { NextResponse } from 'next/server'
import { getDateFromDatabase } from '@/lib/supabase'
import {
  isAtLeast18OnDate,
  validatePeselAgainstBirthDate,
} from '@/lib/paymentIdentity'

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      birthDate?: unknown
      pesel?: unknown
    } | null

    if (
      !body ||
      typeof body.birthDate !== 'string' ||
      typeof body.pesel !== 'string'
    ) {
      return NextResponse.json(
        { valid: false, error: 'Podaj datę urodzenia i numer PESEL.' },
        { status: 400 },
      )
    }

    const identityError = validatePeselAgainstBirthDate(
      body.pesel,
      body.birthDate,
    )
    if (identityError) {
      return NextResponse.json(
        { valid: false, error: identityError },
        { status: 400 },
      )
    }

    const tripDate = await getDateFromDatabase('TRIP_DATE')
    if (!tripDate || !isAtLeast18OnDate(body.birthDate, tripDate)) {
      return NextResponse.json(
        {
          valid: false,
          error: tripDate
            ? 'W dniu wyjazdu uczestnik musi mieć ukończone 18 lat.'
            : 'Nie można sprawdzić daty wyjazdu. Spróbuj ponownie później.',
        },
        { status: tripDate ? 400 : 503 },
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Error validating payment identity:', error)
    return NextResponse.json(
      { valid: false, error: 'Nie udało się zweryfikować danych.' },
      { status: 500 },
    )
  }
}