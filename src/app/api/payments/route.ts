import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/payments?userId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('userId', userId)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('GET /api/payments error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

// POST /api/payments
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, payment } = body as {
      user: { id: string };
      payment: any;
    };

    if (!user?.id) {
      return NextResponse.json({ error: 'Missing user' }, { status: 400 });
    }

    const payload = {
      userId: user.id,
      ...payment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('payments').insert([payload]).select();
    if (error || !data || !data[0]) {
      console.error('Insert payment error', error);
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }

    return NextResponse.json({ id: data[0].id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/payments error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
