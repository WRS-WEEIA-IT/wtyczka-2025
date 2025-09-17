# Payment Form Access Control

## Overview

This document explains how the payment form access control works in the Wtyczka 2025 application. The system uses a two-step access control:

1. **Date-based access control**: The form is completely locked until a specified date (`PAYMENT_OPEN_DATE` in the `.env` file).
2. **Password protection**: After the date is reached, the form requires a password to access.

## Implementation

### API Endpoints

The application uses the following API endpoint for access control:

- `/api/check-access/payment-form`: Checks if the current date has passed the `PAYMENT_OPEN_DATE`

### Flow Diagram

```
┌────────────┐     ┌───────────┐     ┌───────────────┐     ┌────────────┐
│ Start Page │────►│ Date Check │────►│ Password Form │────►│ Full Form  │
└────────────┘     └───────────┘     └───────────────┘     └────────────┘
                       │                    │
                       ▼                    ▼
               ┌─────────────┐      ┌─────────────┐
               │ Form Locked │      │  Incorrect  │
               │  Message   │      │  Password   │
               └─────────────┘      └─────────────┘
```

### Access States

1. **Form Locked** (`isPaymentOpen === false`)
   - Current date is before `PAYMENT_OPEN_DATE`
   - Shows "Formularz płatności niedostępny" message
   - Displays the date when the form will be available

2. **Password Required** (`isPaymentOpen === true && isAuthorized === false`)
   - Current date is on or after `PAYMENT_OPEN_DATE`
   - Shows password input form
   - Requires correct admin password to proceed

3. **Form Accessible** (`isPaymentOpen === true && isAuthorized === true`)
   - Password has been verified
   - Full payment form is displayed

## Testing

Use the following tools for testing:

1. `payment-access-test.html`: Browser-based tool for checking API responses
2. `check-env.ps1`: PowerShell script for verifying date comparisons

### Testing Steps

1. Set a future date in `.env` (e.g., `PAYMENT_OPEN_DATE=2030-01-01`)
   - Expected: Form should show "unavailable" message
   
2. Set a past date in `.env` (e.g., `PAYMENT_OPEN_DATE=2020-01-01`)
   - Expected: Form should show password input
   
3. Set a future date but access with admin cookie
   - Expected: Form should still show "unavailable" message (admin bypass removed)

## Troubleshooting

If the form is not displaying the correct state:

1. Check `.env` file for correct date format: `YYYY-MM-DD`
2. Restart the Next.js development server
3. Clear browser cache or try in incognito mode
4. Check browser console for API errors
5. Verify API responses using `payment-access-test.html`