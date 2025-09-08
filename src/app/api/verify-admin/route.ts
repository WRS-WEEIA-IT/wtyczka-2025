import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body as { password?: string };

    const expected = process.env.PAYMENT_FORM_PASSWORD;
    if (!expected) {
      return NextResponse.json(
        { ok: false, error: 'Server misconfiguration: PAYMENT_FORM_PASSWORD is not set.' },
        { status: 500 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { ok: false, error: 'Missing password' },
        { status: 400 }
      );
    }

    if (password === expected) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
