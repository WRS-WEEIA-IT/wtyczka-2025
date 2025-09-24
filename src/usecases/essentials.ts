import { supabase } from '@/lib/supabase';
import { AuthUser } from "@supabase/supabase-js";

export interface EssentialItem {
  id: number;
  category: string;
  item: string;
}

export interface EssentialCheckedItem {
  essentialId: number;
  userId: string;
  checked: boolean;
  updatedAt: string;
}

// Fetch all essential items from the database
export async function getEssentials(): Promise<EssentialItem[]> {
  try {
    const { data, error } = await supabase
      .from('essentials')
      .select('id, category, item')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching essentials:', error);
    throw new Error('Failed to fetch essentials data');
  }
}

// Fetch user's checked essential items
export async function getUserEssentialsChecked(user: AuthUser | null): Promise<{ [essentialId: number]: boolean }> {
  if (!user) {
    return {};
  }

  try {
    const { data, error } = await supabase
      .from('checkedEssentials')
      .select('essentialId, checked')
      .eq('userId', user.id);

    if (error) throw error;

    // Convert array to object for easy lookup
    const checkedMap: { [essentialId: number]: boolean } = {};
    data?.forEach(item => {
      checkedMap[item.essentialId] = item.checked;
    });

    return checkedMap;
  } catch (error) {
    console.error('Error fetching user essentials checked:', error);
    return {};
  }
}

// Update or insert essential item checked status
export async function updateEssentialChecked(
  user: AuthUser | null,
  essentialId: number,
  checked: boolean
): Promise<void> {
  if (!user) return

  try {
    // First, try to update existing record
    const { error: updateError } = await supabase
      .from('checkedEssentials')
      .upsert({
        userId: user.id,
        essentialId,
        checked,
        updatedAt: new Date().toISOString(),
      });

    if (updateError) throw updateError;
    
    console.log('Successfully updated essential item:', { essentialId, checked });
  } catch (error) {
    console.error('Error updating essential item:', error);
    throw error;
  }
}


