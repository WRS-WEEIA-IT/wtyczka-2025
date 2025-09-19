import { NextResponse } from 'next/server';
import { getDateFromDatabase } from '@/lib/supabase';

export async function GET() {
  // This endpoint is for debugging environment variables only
  // DO NOT use in production as it exposes environment variables
  
  const contactDateFromDB = await getDateFromDatabase('CONTACT_DATE');
  const paymentDateFromDB = await getDateFromDatabase('PAYMENT_OPEN_DATE');
  
  return NextResponse.json({
    // Legacy env variables for comparison
    env_payment_date: process.env.PAYMENT_OPEN_DATE,
    env_contact_date: process.env.CONTACT_DATE,
    
    // New database values
    db_payment_date: paymentDateFromDB,
    db_contact_date: contactDateFromDB,
    
    // Current time info
    current_time: new Date().toISOString(),
    current_time_obj: new Date(),
    
    // Comparisons with database values
    db_payment_time_obj: paymentDateFromDB ? new Date(paymentDateFromDB) : null,
    db_contact_time_obj: contactDateFromDB ? new Date(contactDateFromDB) : null,
    db_payment_comparison: paymentDateFromDB ? new Date() >= new Date(paymentDateFromDB) : null,
    db_contact_comparison: contactDateFromDB ? new Date() >= new Date(contactDateFromDB) : null,
    
    message: 'This is a debug endpoint and should be removed in production!'
  });
}