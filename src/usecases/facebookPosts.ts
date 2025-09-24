import { supabase } from '@/lib/supabase'

export interface FacebookPost {
  id: string
  text: string
  imageUrl?: string
  link: string
  timeCreated: Date
}

export async function getFacebookPostsInQuantity(
  quantity: number,
  page: number,
): Promise<FacebookPost[]> {
  try {
    const { data, error } = await supabase
      .from('facebookPosts')
      .select('id, text, imageUrl, link, timeCreated')
      .order('timeCreated', { ascending: false })
      .range(page * quantity, (page + 1) * quantity - 1)

    if (error) throw error
    return (
      (data.map((post) => ({
        ...post,
        timeCreated: new Date(post.timeCreated),
      })) as FacebookPost[]) || []
    )
  } catch (error) {
    console.error(`Error fetching Facebook posts:`, error)
    throw new Error('Failed to fetch Facebook posts')
  }
}
