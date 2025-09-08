import { supabase } from '@/lib/supabase';

export interface QuestionRecord {
    category: string;
    question: string;
    answer: string;
}

export async function getFAQ(): Promise<QuestionRecord[]> {
    try {
        const { data, error } = await supabase
            .from('faq')
            .select('category, question, answer')
            .order('id', { ascending: true });

        if (error) throw error;
        return data as QuestionRecord[] || [];
    } catch (error) {
        console.error(`Error fetching FAQ:`, error);
        throw new Error('Failed to fetch FAQ data');
    }
}
