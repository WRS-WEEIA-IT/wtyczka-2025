import { supabase } from '@/lib/supabase'

export interface TeamMember {
  id: string
  name: string
  role?: string // Optional role/position in the team
  photoUrl: string
  email: string
  facebookUrl: string
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

    // Ensure proper typing
    return data.map((row: any) => ({
      id: String(row.id),
      name: row.name || '',
      role: row.role || undefined,
      photoUrl: row.photoUrl || '',
      email: row.email || '',
      facebookUrl: row.facebookUrl || '',
    }))
  } catch (err) {
    console.error('Unexpected error fetching organizers:', err)
    return []
  }
}
