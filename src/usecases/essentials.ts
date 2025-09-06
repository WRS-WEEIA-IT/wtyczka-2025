import { supabase } from '@/lib/supabase';

export interface EssentialItem {
  id: number;
  category: string;
  item: string;
}

// Fetch all essential items from the database
export async function getEssentials(): Promise<EssentialItem[]> {
  try {
    const { data, error } = await supabase
      .from('essentials')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching essentials:', error);
    throw new Error('Failed to fetch essentials data');
  }
}


