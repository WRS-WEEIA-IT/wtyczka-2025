"use client";

import { useAuth } from '@/contexts/AuthContext';
import { detectWebView } from '@/lib/webviewDetection';
import { useState, useEffect } from 'react';

/**
 * Debug component to test WebView detection
 * Only shows in development mode
 */
export default function WebViewDebugger() {
  const { webViewInfo } = useAuth();
  const [detectedInfo, setDetectedInfo] = useState<ReturnType<typeof detectWebView> | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setDetectedInfo(detectWebView());
      setShowDebugger(true);
    }
  }, []);

  if (!showDebugger || !detectedInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-black/90 border border-amber-400/40 rounded-lg p-4 text-xs text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-amber-400">WebView Debug</h3>
          <button
            onClick={() => setShowDebugger(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-1">
          <div>
            <span className="text-gray-400">Is WebView:</span>
            <span className={`ml-2 ${detectedInfo.isWebView ? 'text-red-400' : 'text-green-400'}`}>
              {detectedInfo.isWebView ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div>
            <span className="text-gray-400">Platform:</span>
            <span className="ml-2 text-amber-400">{detectedInfo.platform}</span>
          </div>
          
          <div>
            <span className="text-gray-400">WebView Type:</span>
            <span className="ml-2 text-amber-400">{detectedInfo.webViewType}</span>
          </div>
          
          <div>
            <span className="text-gray-400">Can Open External:</span>
            <span className={`ml-2 ${detectedInfo.canOpenExternal ? 'text-green-400' : 'text-red-400'}`}>
              {detectedInfo.canOpenExternal ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-600">
            <span className="text-gray-400">User Agent:</span>
            <div className="text-xs text-gray-300 mt-1 break-all">
              {detectedInfo.userAgent.substring(0, 100)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
