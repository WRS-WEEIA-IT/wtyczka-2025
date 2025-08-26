import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

import { translations } from './translations';
export function handleSupabaseError(error: unknown, lang: 'pl' | 'en'): string {
  if (error instanceof Error) {
    return error.message || translations[lang].errors.unexpected;
  }
  return translations[lang].errors.unexpected;
}