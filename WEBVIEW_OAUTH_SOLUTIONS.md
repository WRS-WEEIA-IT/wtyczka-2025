# WebView OAuth Solutions for Google Login

This document explains the implemented solutions for handling Google OAuth in WebView environments (Facebook Messenger, Instagram, etc.) where Google blocks OAuth requests due to security restrictions.

## Problem

When users access the website through Facebook Messenger or other WebView environments on mobile devices, Google OAuth returns a 403 "disallowed user-agent" error. This is a common issue that prevents users from logging in through Google.

## Implemented Solutions

### 1. WebView Detection ✅

**File:** `src/lib/webviewDetection.ts`

- Detects various WebView environments (Facebook, Messenger, Instagram, Twitter, generic WebView)
- Identifies platform (iOS, Android, Desktop)
- Determines if external browser can be opened
- Provides user agent analysis

**Features:**
- Facebook/Meta WebView detection (`fban`, `fbav`, `fbsv`)
- Messenger WebView detection
- Instagram WebView detection
- Twitter WebView detection
- Generic WebView detection (iOS WKWebView, Android WebView)
- Platform detection (iOS, Android, Desktop)

### 2. User-Agent Rewriting ✅

**Files:** 
- `src/app/api/oauth/google/route.ts`
- `src/app/oauth/google/webview/page.tsx`

- Server-side API route that detects WebView requests
- Redirects WebView users to specialized handling page
- Attempts to modify OAuth flow for WebView compatibility

**Features:**
- Server-side WebView detection
- Specialized OAuth handling for WebView users
- Fallback mechanisms for failed OAuth attempts

### 3. Force External Browser Opening ✅

**File:** `src/lib/webviewDetection.ts`

- Automatically attempts to open external browser
- Platform-specific URL schemes (Chrome, Safari)
- Intent URLs for Android
- Fallback mechanisms

**Features:**
- iOS: `googlechrome://` scheme with Safari fallback
- Android: Intent URLs for Chrome
- Desktop: Standard `window.open()`
- Error handling and fallbacks

### 4. External Browser Prompt ✅

**File:** `src/lib/webviewDetection.ts`

- User-friendly modal prompting to open external browser
- Western-themed design matching the app
- Clear instructions for users
- Confirmation/cancellation options

**Features:**
- Custom modal with Western theme
- Platform-specific instructions
- Keyboard navigation (Escape to close)
- Click outside to close
- Callback functions for user actions

### 5. Hide Google Button (Conditional) ✅

**File:** `src/components/AuthModal.tsx`

- Shows different UI for WebView vs regular browsers
- WebView users see warning message and modified button
- Regular browsers see standard Google login button
- Contextual messaging based on WebView type

**Features:**
- Conditional rendering based on WebView detection
- Warning message for WebView users
- Different styling for WebView context
- Type-specific messaging (Facebook, Messenger, etc.)

## Implementation Details

### AuthContext Updates

**File:** `src/contexts/AuthContext.tsx`

- Added `authLoginWithGoogleWebView()` method
- Added `isWebView` and `webViewInfo` properties
- Integrated all workaround solutions
- Maintains backward compatibility

### AuthModal Updates

**File:** `src/components/AuthModal.tsx`

- Uses WebView-aware Google login method
- Shows different UI for WebView users
- Displays contextual warnings and instructions
- Maintains existing functionality for regular browsers

### API Routes

**File:** `src/app/api/oauth/google/route.ts`

- Server-side WebView detection
- Redirects WebView users to specialized handling
- Normal OAuth flow for regular browsers
- Error handling and logging

**File:** `src/app/oauth/google/webview/page.tsx`

- Specialized page for WebView OAuth handling
- Loading states and error handling
- External browser opening attempts
- User-friendly messaging

## Usage

The solutions are automatically applied when users access the login modal:

1. **Regular Browsers:** Standard Google OAuth flow
2. **WebView Users:** 
   - Warning message displayed
   - Automatic external browser opening attempt
   - User prompt if automatic opening fails
   - Fallback to direct OAuth attempt

## Testing

To test the WebView solutions:

1. **Facebook Messenger:** Open the website in Facebook Messenger on mobile
2. **Instagram:** Open the website in Instagram's in-app browser
3. **Regular Browser:** Test in Chrome, Safari, Firefox to ensure normal flow works

## Configuration

The solutions are automatically enabled and require no additional configuration. The WebView detection runs on every page load and login attempt.

## Browser Compatibility

- **iOS:** Chrome, Safari, WebView detection
- **Android:** Chrome, WebView detection
- **Desktop:** All major browsers
- **WebView:** Facebook, Messenger, Instagram, Twitter, generic WebView

## Error Handling

- Graceful fallbacks for each workaround
- User-friendly error messages
- Logging for debugging
- Toast notifications for user feedback

## Future Improvements

1. **Deep Linking:** Implement app-specific deep links for better external browser opening
2. **Analytics:** Track WebView usage and success rates
3. **A/B Testing:** Test different approaches for WebView users
4. **Progressive Enhancement:** Gradually improve WebView support as browser capabilities evolve

## Security Considerations

- All external browser opening uses standard URL schemes
- No sensitive data is exposed in URLs
- User confirmation required for external browser opening
- Fallback mechanisms prevent user lockout

## Performance

- WebView detection is lightweight and runs once per session
- No additional network requests for detection
- Cached detection results in AuthContext
- Minimal impact on regular browser performance
