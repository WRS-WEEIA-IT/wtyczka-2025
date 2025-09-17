param (
    [string]$paymentDate
)

$envFile = ".env"

# Check if .env file exists
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found in the current directory." -ForegroundColor Red
    exit 1
}

# Read the current date if no date is provided
if (-not $paymentDate) {
    $currentDate = ""
    
    # Try to extract the current payment date from the .env file
    $content = Get-Content $envFile -ErrorAction SilentlyContinue
    foreach ($line in $content) {
        if ($line -match '^PAYMENT_OPEN_DATE=(.*)') {
            $currentDate = $matches[1] -replace '"', ''
            break
        }
    }
    
    Write-Host "Current payment open date: $currentDate" -ForegroundColor Cyan
    $paymentDate = Read-Host "Enter new payment open date [YYYY-MM-DD]"
    
    if (-not $paymentDate) {
        Write-Host "No date provided. Operation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Validate date format
if ($paymentDate -notmatch '^\d{4}-\d{2}-\d{2}$') {
    Write-Host "Error: Date must be in format YYYY-MM-DD" -ForegroundColor Red
    exit 1
}

# Read the content of the .env file
$content = Get-Content $envFile -ErrorAction SilentlyContinue

# Check if PAYMENT_OPEN_DATE already exists
$found = $false
$newContent = @()

foreach ($line in $content) {
    if ($line -match '^PAYMENT_OPEN_DATE=') {
        $newContent += "PAYMENT_OPEN_DATE=$paymentDate"
        $found = $true
    } else {
        $newContent += $line
    }
}

# If PAYMENT_OPEN_DATE was not found, add it to the end
if (-not $found) {
    $newContent += "PAYMENT_OPEN_DATE=$paymentDate"
}

# Write the updated content back to the .env file
$newContent | Set-Content $envFile

Write-Host "Payment open date has been updated to: $paymentDate" -ForegroundColor Green
Write-Host "Restart your Next.js server for changes to take effect." -ForegroundColor Yellow