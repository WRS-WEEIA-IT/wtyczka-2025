import { NextResponse } from 'next/server';

export async function GET() {
  // This endpoint is for debugging environment variables only
  // DO NOT use in production as it exposes environment variables
  return NextResponse.json({
    payment_date: process.env.PAYMENT_OPEN_DATE,
    current_time: new Date().toISOString(),
    current_time_obj: new Date(),
    payment_time_obj: process.env.PAYMENT_OPEN_DATE ? new Date(process.env.PAYMENT_OPEN_DATE) : null,
    comparison: process.env.PAYMENT_OPEN_DATE ? new Date() >= new Date(process.env.PAYMENT_OPEN_DATE) : null,
    message: 'This is a debug endpoint and should be removed in production!'
  });
}