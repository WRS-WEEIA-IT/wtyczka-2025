import { NextResponse } from 'next/server';
import { getTeamMembers } from '@/usecases/team-members';
import { getDateFromDatabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if access is allowed based on date
    const contactDateStr = await getDateFromDatabase('CONTACT_DATE');
    
    if (contactDateStr) {
      const now = new Date();
      const contactDate = new Date(contactDateStr);
      
      if (now < contactDate) {
        // If not yet available, return 403
        return NextResponse.json({ error: 'Content not available yet' }, { status: 403 });
      }
    }
    
    // Get team members data
    const teamMembers = getTeamMembers();
    
    // Return the data
    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Error getting team members:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}