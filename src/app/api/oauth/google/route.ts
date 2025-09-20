import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Google OAuth API route with WebView workarounds
 * This route handles Google OAuth requests and can modify headers for WebView compatibility
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect_to') || '/';
    const userAgent = request.headers.get('user-agent') || '';
    
    // Detect if this is a WebView request
    const isWebView = detectWebViewFromUserAgent(userAgent);
    
    if (isWebView) {
      // For WebView requests, we'll redirect to a special page that handles the OAuth flow
      // with modified headers or external browser opening
      const webViewOAuthUrl = new URL('/oauth/google/webview', request.url);
      webViewOAuthUrl.searchParams.set('redirect_to', redirectTo);
      webViewOAuthUrl.searchParams.set('user_agent', userAgent);
      
      return NextResponse.redirect(webViewOAuthUrl);
    }
    
    // For regular browsers, proceed with normal OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${request.nextUrl.origin}${redirectTo}`,
      },
    });
    
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (data.url) {
      return NextResponse.redirect(data.url);
    }
    
    return NextResponse.json({ error: 'No OAuth URL generated' }, { status: 500 });
    
  } catch (error) {
    console.error('OAuth route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Detect WebView from user agent string
 */
function detectWebViewFromUserAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  
  // Facebook/Meta WebView detection
  if (ua.includes('fban') || ua.includes('fbav') || ua.includes('fbsv')) {
    return true;
  }
  
  // Messenger WebView detection
  if (ua.includes('messenger') || ua.includes('fban/ios') || ua.includes('fban/android')) {
    return true;
  }
  
  // Instagram WebView detection
  if (ua.includes('instagram')) {
    return true;
  }
  
  // Twitter WebView detection
  if (ua.includes('twitter') || ua.includes('tweetdeck')) {
    return true;
  }
  
  // Generic WebView detection
  if (
    (ua.includes('iphone') && ua.includes('safari') && !ua.includes('crios') && !ua.includes('fxios')) ||
    (ua.includes('android') && ua.includes('wv') && !ua.includes('chrome')) ||
    ua.includes('webview')
  ) {
    return true;
  }
  
  return false;
}
