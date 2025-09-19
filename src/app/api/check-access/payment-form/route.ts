import { NextResponse } from 'next/server';
import { getDateFromDatabase } from '../../../../lib/supabase';

export async function GET(_request: Request) {
  try {
    // Poprzednia logika sprawdzania cookie admina usunięta, ponieważ nie była używana
    
    // Check payment date
    const paymentDateStr = await getDateFromDatabase('PAYMENT_OPEN_DATE');
    
    if (!paymentDateStr) {
      // If no date is set, deny access by default
      return NextResponse.json({ 
        ok: true, 
        access: false,
        message: "Formularz płatności niedostępny - data otwarcia nie została określona"
      });
    }
    
    const now = new Date();
    const paymentDate = new Date(paymentDateStr);
    
    // Convert to timestamps for reliable comparison
    const nowTimestamp = now.getTime();
    const paymentTimestamp = paymentDate.getTime();
    
    // Access is granted only based on date (not admin cookie)
    const isDatePassed = nowTimestamp >= paymentTimestamp;
    
    // For debugging
    console.log(`Current date: ${now.toISOString()}`);
    console.log(`Payment date: ${paymentDate.toISOString()}`);
    console.log(`Is date passed: ${isDatePassed}`);
    
    if (isDatePassed) {
      // Date requirement is met - allow access
      return NextResponse.json({ 
        ok: true, 
        access: true,
        date: paymentDateStr,
        isOpen: true,
        message: "Payment form is available"
      });
    } else {
      // Access denied - date requirement not met
      const timeRemaining = paymentDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
      
      return NextResponse.json(
        { 
          ok: true, 
          access: false,
          date: paymentDateStr,
          isOpen: false,
          daysRemaining: daysRemaining,
          message: "Formularz płatności niedostępny" 
        }, 
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error checking payment form access:', error);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}