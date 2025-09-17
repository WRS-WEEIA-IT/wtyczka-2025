# Security Implementation for Protected Content

This document describes the security measures implemented to protect specific content based on dates and admin authorization.

## Overview

The website has two main access restrictions:

1. **Contacts page** - Protected by a date-based restriction
2. **Payment form** - Protected by both date-based restriction and an admin password

## Security Architecture

We've implemented a multi-layered security approach:

### 1. Server-Side API Protection

The primary security layer uses server-side API endpoints to control access to sensitive data. This prevents users from accessing content by manipulating client-side code or variables.

### 2. Server-Side Environment Variables

All sensitive configuration like dates and passwords are stored in `.env` (not exposed to the client). This keeps all security-sensitive settings strictly server-side.

### 3. API-based Access Control

API endpoints provide server-side validation for all protected content:
- `/api/check-access/contacts` - Validates contact page access
- `/api/check-access/payment` - Validates payment page access
- `/api/check-access/payment-form` - Validates payment form access with admin override

### 4. Enhanced Password Protection

The admin password verification includes:
- Rate limiting to prevent brute force attacks
- Secure cookie handling for admin sessions
- Timeout mechanism for invalid login attempts

## Content Protection Approach

The site shows placeholder pages for restricted content, but the actual data is never loaded to the client until the access dates are reached:

1. Users can see placeholder pages (like "Kadra zostanie ujawniona wkrótce" and "Formularz płatności niedostępny")
2. The actual content/data is completely protected on the server side
3. All API calls to fetch the protected data are blocked until the release dates

## How to Update Security Settings

### Using the Script

Run the provided PowerShell script `update-security.ps1` to update settings:

```powershell
# Interactive mode (will prompt for values)
.\update-security.ps1

# Direct mode with parameters
.\update-security.ps1 -contactDate "2025-12-01" -paymentDate "2025-10-01" -adminPassword "new_password"
```

### Manual Updates

If you need to manually update settings, edit the `.env` file to update server-side variables:
```
CONTACT_DATE=2025-12-01
PAYMENT_OPEN_DATE=2025-10-01
PAYMENT_FORM_PASSWORD=your_admin_password
```

Then restart the server for changes to take effect.

## How It Works

1. When a user tries to access a protected page:
   - The page loads with placeholder content
   - API endpoints check if the user should have access to the actual content
   - If not allowed, only the placeholder is shown

2. For admin password protection:
   - Admin enters password in the payment form
   - Server verifies password and sets a secure HTTP-only cookie
   - This cookie allows temporary access to the payment form

3. API Middleware:
   - Blocks access to data API endpoints until the specified dates
   - Allows admin access with valid authentication cookie

## Security Best Practices

- The admin password is never exposed to the client
- Dates for access control are validated server-side only
- Protected content data never reaches the client until release dates
- Rate limiting prevents brute force attacks
- HTTP-only cookies protect admin sessions