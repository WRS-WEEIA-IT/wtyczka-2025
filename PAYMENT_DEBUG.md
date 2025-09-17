# Payment Form Access Debug Guide

This guide will help you diagnose and fix issues with the payment form date-based access control.

## Problem

The payment form should be locked (showing the "unavailable" message) when the current date is earlier than the `PAYMENT_OPEN_DATE` environment variable. However, it's showing as available despite having a date set in the future.

## Debugging Tools

Several tools have been created to help diagnose this issue:

1. **check-env.ps1** - PowerShell script to verify environment variable date comparison
   ```powershell
   .\check-env.ps1         # List all environment variables
   .\check-env.ps1 -check  # Check date comparison logic
   ```

2. **api-debug.html** - Browser tool to directly test API responses
   - Open this file in your browser when the development server is running
   - Click on buttons to test different API endpoints

3. **/api/debug/env** - API endpoint that shows environment variable information
   - This is a diagnostic endpoint that should be removed before production

## Steps to Test

1. **Restart the development server** with environment variables:
   ```powershell
   npm run dev
   ```

2. **Open your browser** to http://localhost:3000/payment to check if the form is correctly locked.

3. **Use the api-debug.html** tool to directly check API responses:
   - If using local development: http://localhost:3000/api-debug.html

4. **Check the server logs** in your terminal for the debug information added to the API routes.

## Expected Behavior

- When current date is BEFORE `PAYMENT_OPEN_DATE`: Form should be LOCKED (showing unavailable message)
- When current date is ON or AFTER `PAYMENT_OPEN_DATE`: Form should show password input

## Common Issues & Solutions

1. **Environment Variables Not Loading**
   - Check that your `.env` file is in the correct location (root of project)
   - Restart the development server after modifying `.env`
   
2. **Invalid Date Format**
   - Ensure the date is in YYYY-MM-DD format
   - Check that the date is valid (e.g., not 2023-02-30)

3. **Timezone Issues**
   - Date comparison might be affected by server timezone
   - Use the debug tools to see exact timestamps being compared

4. **Caching Issues**
   - Clear your browser cache or use incognito/private mode
   - Restart the development server

## Permanent Solution

The changes made should fix the issue by:

1. Using explicit timestamp comparison instead of direct Date object comparison
2. Adding more extensive debug logging
3. Being more strict about checking the access flag in the frontend