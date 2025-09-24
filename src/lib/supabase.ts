import { createClient } from '@supabase/supabase-js'

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase URL available:', !!supabaseUrl)
  console.log('Supabase key available:', !!supabaseKey)
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
}

// Create the client
export const supabase = createClient(
  supabaseUrl || 'https://bvzdouqtahdyiaaxywsw.supabase.co', // Fallback URL from your example
  supabaseKey || '', // Empty fallback will trigger auth errors which is good for debugging
)

import { translations } from './translations'

// Cache for dates to avoid frequent database calls
const dateCache: { [key: string]: string } = {}
let cacheExpiry: number = 0
const CACHE_DURATION = 10 * 1000 // 10 seconds (reduced from 5 minutes for faster testing)

export async function getDateFromDatabase(
  dateName: 'CONTACT_DATE' | 'PAYMENT_OPEN_DATE',
): Promise<string | null> {
  // Check cache first
  const now = Date.now()
  if (cacheExpiry > now && dateCache[dateName]) {
    return dateCache[dateName]
  }

  try {
    const { data, error } = await supabase
      .from('dates')
      .select('date')
      .eq('name', dateName)
      .single()

    if (error) {
      console.error(`Error fetching ${dateName} from database:`, error)
      return null
    }

    if (data) {
      // Update cache
      dateCache[dateName] = data.date
      cacheExpiry = now + CACHE_DURATION
      return data.date
    }

    return null
  } catch (error) {
    console.error(`Error fetching ${dateName} from database:`, error)
    return null
  }
}

export function handleSupabaseError(error: unknown, lang: 'pl' | 'en'): string {
  const defaultLang = 'pl'
  const useLang = translations[lang as keyof typeof translations]
    ? lang
    : defaultLang

  if (error instanceof Error) {
    return error.message || translations[useLang as 'pl'].errors.unexpected
  }
  return translations[useLang as 'pl'].errors.unexpected
}
