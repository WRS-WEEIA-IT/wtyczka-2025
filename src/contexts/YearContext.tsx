'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'

interface YearContextType {
  year: string
}

const YearContext = createContext<YearContextType | undefined>(undefined)

export function YearProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState<string>('2025')

  useEffect(() => {
    let mounted = true
    async function loadYear() {
      try {
        const { data, error } = await supabase
          .from('data')
          .select('value')
          .eq('key', 'year')
          .single()

        if (error) {
          console.error('Error fetching year from database:', error)
          return
        }

        if (data && mounted) {
          const v = data.value
          if (typeof v === 'string' && v.trim() !== '') setYear(v.trim())
        }
      } catch (e) {
        console.error('Unexpected error fetching year:', e)
      }
    }

    loadYear()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <YearContext.Provider value={{ year }}>{children}</YearContext.Provider>
  )
}

export function useYear() {
  const ctx = useContext(YearContext)
  if (!ctx) {
    throw new Error('useYear must be used within a YearProvider')
  }
  return ctx
}
