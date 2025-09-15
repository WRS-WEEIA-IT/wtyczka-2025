import { supabase } from '../lib/supabase';

// Define the partner interface matching the database structure exactly
export interface Partner {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  category: string | null;
}

// Define available partner categories
export type PartnerCategory = 'partner' | 'patronat' | 'kolo';

export const PARTNER_CATEGORIES: PartnerCategory[] = ['partner', 'patronat', 'kolo'];

// Define category display names in Polish
export const CATEGORY_DISPLAY_NAMES: Record<PartnerCategory, string> = {
  'partner': 'Partnerzy',
  'patronat': 'Patroni',
  'kolo': 'Koła Naukowe'
};

/**
 * Fetches all partners from the database
 * @returns A promise resolving to an array of partners
 */
export async function getPartners(): Promise<Partner[]> {
  // Add more detailed logging
  console.log('Fetching partners from database...');
  
  try {
    // First try with the correct spelling 'partners'
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching from partners table:', error);
      
      // If there was an error, try with the alternative spelling 'parnters' from the constraint
      const alternativeResult = await supabase
        .from('parnters') // Try alternative spelling based on constraint name
        .select('*')
        .order('name');
        
      if (alternativeResult.error) {
        console.error('Error fetching from parnters table:', alternativeResult.error);
        throw new Error(`Failed to fetch partners data: ${alternativeResult.error.message}`);
      }
      
      console.log('Partners data received from parnters table:', alternativeResult.data);
      return alternativeResult.data || [];
    }

    console.log('Partners data received from partners table:', data);
    
    // Check if data is empty and log it
    if (!data || data.length === 0) {
      console.warn('No partners found in database');
      return [];
    }
    
    console.log(`Found ${data.length} partners in database`);
    return data;
  } catch (err) {
    console.error('Unexpected error fetching partners:', err);
    throw new Error(`Failed to fetch partners data: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

/**
 * Fetches partners by category
 * @param category The category to filter by
 * @returns A promise resolving to an array of partners in the specified category
 */
export async function getPartnersByCategory(category: PartnerCategory): Promise<Partner[]> {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) {
      console.error('Error fetching partners by category:', error);
      throw new Error(`Failed to fetch partners for category ${category}: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error(`Error fetching partners in category ${category}:`, err);
    throw new Error(`Failed to fetch partners for category ${category}: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

/**
 * Fetches all partners grouped by category
 * @returns A promise resolving to an object with partners grouped by category
 */
export async function getPartnersByCategories(): Promise<Record<PartnerCategory, Partner[]>> {
  const allPartners = await getPartners();
  
  // Create an object to store partners by category
  const result: Partial<Record<PartnerCategory, Partner[]>> = {};
  
  // Initialize each category with an empty array
  PARTNER_CATEGORIES.forEach(category => {
    result[category] = [];
  });
  
  // Group partners by category
  allPartners.forEach(partner => {
    if (partner.category && PARTNER_CATEGORIES.includes(partner.category as PartnerCategory)) {
      const category = partner.category as PartnerCategory;
      if (!result[category]) {
        result[category] = [];
      }
      result[category]!.push(partner);
    } else {
      // Default to 'partner' category if no category is specified
      if (!result['partner']) {
        result['partner'] = [];
      }
      result['partner']!.push(partner);
    }
  });
  
  // Sort partners within each category by name
  Object.keys(result).forEach(category => {
    const typedCategory = category as PartnerCategory;
    result[typedCategory] = result[typedCategory]?.sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return result as Record<PartnerCategory, Partner[]>;
}
