import { supabase } from '@/lib/supabase'

export interface TeamMember {
  id: string
  name: string
  role?: string // Optional role/position in the team
  photoUrl: string
  email: string
  facebookUrl: string
}

interface OrganizerRow {
  id: unknown
  name: unknown
  role: unknown
  photoUrl: unknown
  email: unknown
  facebookUrl: unknown
}

// Fetch team members (organizers) from Supabase
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('organizers')
      .select('id, name, role, photoUrl, email, facebookUrl')

    if (error) {
      console.error('Error fetching organizers from DB:', error)
      return []
    }

    if (!data || data.length === 0) return []

    return data.map((row: OrganizerRow) => ({
      id: String(row.id ?? ''),
      name: typeof row.name === 'string' ? row.name : '',
      role: typeof row.role === 'string' ? row.role : undefined,
      photoUrl: typeof row.photoUrl === 'string' ? row.photoUrl : '',
      email: typeof row.email === 'string' ? row.email : '',
      facebookUrl: typeof row.facebookUrl === 'string' ? row.facebookUrl : '',
    }))
  } catch (err) {
    console.error('Unexpected error fetching organizers:', err)
    return []
  }
}
