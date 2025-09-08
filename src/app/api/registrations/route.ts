import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/registrations?userId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('userId', userId)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('GET /api/registrations error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

// POST /api/registrations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, registration } = body as {
      user: { id: string; email?: string | null };
      registration: any;
    };

    if (!user?.id || !user?.email) {
      return NextResponse.json({ error: 'Missing user' }, { status: 400 });
    }

    const payload = {
      over18: true, // TODO: compute from dob if needed
      userId: user.id,
      email: user.email,
      ...registration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('registrations').insert([payload]).select();
    if (error || !data || !data[0]) {
      console.error('Insert registration error', error);
      return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 });
    }

    return NextResponse.json({ id: data[0].id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/registrations error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
