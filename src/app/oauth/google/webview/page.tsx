"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { detectWebView, showExternalBrowserPrompt } from '@/lib/webviewDetection';

function WebViewOAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const redirectTo = searchParams.get('redirect_to') || '/';

  useEffect(() => {
    const handleWebViewOAuth = async () => {
      try {
        const webViewInfo = detectWebView();
        
        if (!webViewInfo.isWebView) {
          // Not in WebView, redirect to normal OAuth
          router.push('/api/oauth/google?redirect_to=' + encodeURIComponent(redirectTo));
          return;
        }

        // We're in a WebView - show prompt to user
        showExternalBrowserPrompt(
          () => {
            // User confirmed - just close modal and redirect back
            router.push(redirectTo);
          },
          () => {
            // User cancelled - redirect back
            router.push(redirectTo);
          },
          webViewInfo.platform
        );
        
      } catch (err) {
        console.error('WebView OAuth error:', err);
        setError('Wystąpił błąd podczas próby logowania');
      } finally {
        setLoading(false);
      }
    };

    handleWebViewOAuth();
  }, [redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#232323] via-[#18181b] to-[#232323] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-400/20 rounded-full flex items-center justify-center animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Ładowanie...</h2>
          <p className="text-gray-300">Przygotowujemy logowanie przez Google</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#232323] via-[#18181b] to-[#232323] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-400/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Błąd logowania</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push(redirectTo)}
            className="bg-amber-400 text-black py-3 px-6 rounded-xl hover:bg-amber-500 font-semibold transition-colors"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  // This should never be reached since we redirect immediately after showing the prompt
  return null;
}

export default function WebViewOAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#232323] via-[#18181b] to-[#232323] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-400/20 rounded-full flex items-center justify-center animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Ładowanie...</h2>
        </div>
      </div>
    }>
      <WebViewOAuthContent />
    </Suspense>
  );
}
