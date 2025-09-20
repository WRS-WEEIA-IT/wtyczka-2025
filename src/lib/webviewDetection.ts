/**
 * WebView Detection and OAuth Workaround Utilities
 * 
 * This module provides utilities to detect WebView environments and implement
 * various workarounds for Google OAuth issues in WebView contexts.
 */

export interface WebViewInfo {
  isWebView: boolean;
  userAgent: string;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  webViewType: 'facebook' | 'messenger' | 'instagram' | 'twitter' | 'generic' | 'none';
  canOpenExternal: boolean;
}

/**
 * Detects if the current environment is a WebView
 */
export function detectWebView(): WebViewInfo {
  if (typeof window === 'undefined') {
    return {
      isWebView: false,
      userAgent: '',
      platform: 'unknown',
      webViewType: 'none',
      canOpenExternal: false,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  // Detect platform
  let platform: 'ios' | 'android' | 'desktop' | 'unknown' = 'unknown';
  if (/iphone|ipad|ipod/.test(userAgent)) {
    platform = 'ios';
  } else if (/android/.test(userAgent)) {
    platform = 'android';
  } else if (/windows|macintosh|linux/.test(userAgent)) {
    platform = 'desktop';
  }

  // Detect WebView type
  let webViewType: 'facebook' | 'messenger' | 'instagram' | 'twitter' | 'generic' | 'none' = 'none';
  let isWebView = false;

  // Facebook/Meta WebView detection
  if (userAgent.includes('fban') || userAgent.includes('fbav') || userAgent.includes('fbsv')) {
    webViewType = 'facebook';
    isWebView = true;
  }
  // Messenger WebView detection
  else if (userAgent.includes('messenger') || userAgent.includes('fban/ios') || userAgent.includes('fban/android')) {
    webViewType = 'messenger';
    isWebView = true;
  }
  // Instagram WebView detection
  else if (userAgent.includes('instagram')) {
    webViewType = 'instagram';
    isWebView = true;
  }
  // Twitter WebView detection
  else if (userAgent.includes('twitter') || userAgent.includes('tweetdeck')) {
    webViewType = 'twitter';
    isWebView = true;
  }
  // Generic WebView detection (iOS WKWebView, Android WebView)
  else if (
    (platform === 'ios' && userAgent.includes('safari') && !userAgent.includes('crios') && !userAgent.includes('fxios')) ||
    (platform === 'android' && userAgent.includes('wv') && !userAgent.includes('chrome')) ||
    userAgent.includes('webview')
  ) {
    webViewType = 'generic';
    isWebView = true;
  }

  // Check if external browser can be opened
  const canOpenExternal = !isWebView || platform === 'desktop';

  return {
    isWebView,
    userAgent,
    platform,
    webViewType,
    canOpenExternal,
  };
}

/**
 * Generates a modified user agent string that mimics a regular browser
 */
export function generateBrowserUserAgent(originalUserAgent: string, platform: string): string {
  const baseUserAgents = {
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    android: 'Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };

  return baseUserAgents[platform as keyof typeof baseUserAgents] || originalUserAgent;
}

/**
 * Creates a URL that will force opening in external browser
 */
export function createExternalBrowserUrl(originalUrl: string, platform: string): string {
  const encodedUrl = encodeURIComponent(originalUrl);
  
  const schemes = {
    ios: `googlechrome://${originalUrl.replace(/^https?:\/\//, '')}`,
    android: `intent://${originalUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`,
    desktop: originalUrl,
  };

  return schemes[platform as keyof typeof schemes] || originalUrl;
}

/**
 * Attempts to open a URL in external browser
 */
export function openInExternalBrowser(url: string, platform: string): boolean {
  try {
    if (platform === 'ios') {
      // Try Chrome first, then Safari
      const chromeUrl = `googlechrome://${url.replace(/^https?:\/\//, '')}`;
      const safariUrl = url;
      
      // Create a temporary link and click it
      const link = document.createElement('a');
      link.href = chromeUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Fallback to Safari after a short delay
      setTimeout(() => {
        window.open(safariUrl, '_blank', 'noopener,noreferrer');
      }, 1000);
      
      return true;
    } else if (platform === 'android') {
      // Try Chrome intent
      const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      
      const link = document.createElement('a');
      link.href = intentUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } else {
      // Desktop - just open normally
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
  } catch (error) {
    console.error('Failed to open external browser:', error);
    return false;
  }
}

/**
 * Shows a modal prompting user to open external browser
 */
export function showExternalBrowserPrompt(
  onConfirm: () => void,
  onCancel: () => void,
  platform: string
): void {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4';
  
  const isMobile = platform === 'ios' || platform === 'android';
  const instructions = isMobile 
    ? 'Aby zalogować się przez Google, otwórz tę stronę w przeglądarce zewnętrznej (Chrome, Safari).'
    : 'Aby zalogować się przez Google, otwórz tę stronę w przeglądarce zewnętrznej.';
  
  modal.innerHTML = `
    <div class="relative w-full max-w-md rounded-xl border border-amber-400/40 bg-gradient-to-br from-[#232323]/95 via-[#18181b]/95 to-[#232323]/90 shadow-2xl shadow-amber-900/30 backdrop-blur-xl px-6 py-8 text-center">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-amber-400 transition-colors" data-action="cancel">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
      <div class="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 mx-auto">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-amber-400 mb-4">Otwórz w przeglądarce</h3>
      <p class="text-gray-300 mb-6">${instructions}</p>
      <div class="flex gap-3">
        <button class="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors" data-action="cancel">
          Anuluj
        </button>
        <button class="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors" data-action="confirm">
          Otwórz w przeglądarce
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  const handleAction = (action: string) => {
    document.body.removeChild(modal);
    if (action === 'confirm') {
      onConfirm();
    } else {
      onCancel();
    }
  };
  
  modal.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');
    if (action) {
      handleAction(action);
    } else if (target === modal) {
      handleAction('cancel');
    }
  });
  
  // Close on escape
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleAction('cancel');
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}
