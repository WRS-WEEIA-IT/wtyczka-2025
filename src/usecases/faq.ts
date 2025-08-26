import { supabase } from '@/lib/supabase';

export interface QuestionRecord {
    question: string;
    answer: string;
}

export async function getFAQByCategory(category: string): Promise<QuestionRecord[]> {
    try {
        const { data, error } = await supabase
            .from('faq')
            .select('question, answer')
            .eq('category', category)
            .order('id', { ascending: true });

        if (error) throw error;
        return data as QuestionRecord[] || [];
    } catch (error) {
        console.error(`Error fetching FAQ for category ${category}:`, error);
        throw new Error('Failed to fetch FAQ data');
    }
}
