import { createClient } from '@supabase/supabase-js';

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase URL available:', !!supabaseUrl);
  console.log('Supabase key available:', !!supabaseKey);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

// Create the client
export const supabase = createClient(
  supabaseUrl || 'https://bvzdouqtahdyiaaxywsw.supabase.co', // Fallback URL from your example
  supabaseKey || '' // Empty fallback will trigger auth errors which is good for debugging
);

import { translations } from './translations';
export function handleSupabaseError(error: unknown, lang: 'pl' | 'en'): string {
  const defaultLang = 'pl';
  const useLang = translations[lang as keyof typeof translations] ? lang : defaultLang;
  
  if (error instanceof Error) {
    return error.message || translations[useLang as 'pl'].errors.unexpected;
  }
  return translations[useLang as 'pl'].errors.unexpected;
}