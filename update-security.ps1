# Update Environment Variables Script
# Use this script to update security-sensitive configuration

param(
    [string]$contactDate,
    [string]$paymentDate,
    [string]$adminPassword
)

# Script header
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  Security Settings Update Tool  " -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Path to env file
$envPath = ".\.env"

# Load current env file
$envContent = Get-Content -Path $envPath -ErrorAction SilentlyContinue

# Interactive mode if no parameters provided
if (-not $contactDate -and -not $paymentDate -and -not $adminPassword) {
    Write-Host "Interactive mode:" -ForegroundColor Yellow
    
    # Extract current values
    $currentContactDate = $envContent | Where-Object { $_ -match 'CONTACT_DATE=(.*)' } | ForEach-Object { $matches[1] }
    $currentPaymentDate = $envContent | Where-Object { $_ -match 'PAYMENT_OPEN_DATE=(.*)' } | ForEach-Object { $matches[1] }
    $currentPassword = $envContent | Where-Object { $_ -match 'PAYMENT_FORM_PASSWORD=(.*)' } | ForEach-Object { $matches[1] }
    
    Write-Host "Current values:" -ForegroundColor Cyan
    Write-Host "  Contact page available after: $currentContactDate"
    Write-Host "  Payment page available after: $currentPaymentDate"
    Write-Host "  Admin password: $currentPassword"
    Write-Host ""
    
    # Get new values
    $contactDate = Read-Host "Enter new contact availability date (YYYY-MM-DD) [leave blank to keep current]"
    $paymentDate = Read-Host "Enter new payment availability date (YYYY-MM-DD) [leave blank to keep current]"
    $adminPassword = Read-Host "Enter new admin password [leave blank to keep current]"
    
    # Use current values if blank
    if (-not $contactDate) { $contactDate = $currentContactDate }
    if (-not $paymentDate) { $paymentDate = $currentPaymentDate }
    if (-not $adminPassword) { $adminPassword = $currentPassword }
}

# Update .env file (server-side variables)
$newEnvContent = @()

$contactDateUpdated = $false
$paymentDateUpdated = $false
$passwordUpdated = $false

foreach ($line in $envContent) {
    if ($contactDate -and $line -match '^CONTACT_DATE=') {
        $newEnvContent += "CONTACT_DATE=$contactDate"
        $contactDateUpdated = $true
    }
    elseif ($paymentDate -and $line -match '^PAYMENT_OPEN_DATE=') {
        $newEnvContent += "PAYMENT_OPEN_DATE=$paymentDate"
        $paymentDateUpdated = $true
    }
    elseif ($adminPassword -and $line -match '^PAYMENT_FORM_PASSWORD=') {
        $newEnvContent += "PAYMENT_FORM_PASSWORD=$adminPassword"
        $passwordUpdated = $true
    }
    else {
        $newEnvContent += $line
    }
}

# Add any missing variables
if ($contactDate -and -not $contactDateUpdated) {
    $newEnvContent += "CONTACT_DATE=$contactDate"
}
if ($paymentDate -and -not $paymentDateUpdated) {
    $newEnvContent += "PAYMENT_OPEN_DATE=$paymentDate"
}
if ($adminPassword -and -not $passwordUpdated) {
    $newEnvContent += "PAYMENT_FORM_PASSWORD=$adminPassword"
}

# Write updated content
$newEnvContent | Set-Content -Path $envPath

# Summary
Write-Host ""
Write-Host "Security settings updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary of changes:" -ForegroundColor Cyan

if ($contactDate) {
    Write-Host "  ✅ Contact page availability date: $contactDate" -ForegroundColor Green
}
if ($paymentDate) {
    Write-Host "  ✅ Payment page availability date: $paymentDate" -ForegroundColor Green
}
if ($adminPassword) {
    Write-Host "  ✅ Admin password updated" -ForegroundColor Green
}

Write-Host ""
Write-Host "IMPORTANT: Restart your server for changes to take effect." -ForegroundColor Yellow
Write-Host ""