param (
    [switch]$enablePaymentForm,
    [switch]$disablePaymentForm,
    [switch]$status
)

$envFile = ".env"

# Check if .env file exists
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found in the current directory." -ForegroundColor Red
    exit 1
}

# Function to get current date in YYYY-MM-DD format
function Get-FormattedDate {
    return Get-Date -Format "yyyy-MM-dd"
}

# Function to get a future date in YYYY-MM-DD format
function Get-FutureDate {
    return (Get-Date).AddYears(5).ToString("yyyy-MM-dd")
}

# Function to get a past date in YYYY-MM-DD format
function Get-PastDate {
    return (Get-Date).AddYears(-1).ToString("yyyy-MM-dd")
}

# Function to update payment date in .env file
function Update-PaymentDate {
    param (
        [string]$newDate
    )
    
    $content = Get-Content $envFile
    $updated = $false
    $newContent = @()
    
    foreach ($line in $content) {
        if ($line -match '^PAYMENT_OPEN_DATE=') {
            $newContent += "PAYMENT_OPEN_DATE=$newDate"
            $updated = $true
        } else {
            $newContent += $line
        }
    }
    
    if (-not $updated) {
        $newContent += "PAYMENT_OPEN_DATE=$newDate"
    }
    
    $newContent | Set-Content $envFile
    return $newDate
}

# Function to get current payment date from .env
function Get-PaymentDate {
    $content = Get-Content $envFile
    foreach ($line in $content) {
        if ($line -match '^PAYMENT_OPEN_DATE=(.*)') {
            return $matches[1] -replace '"', ''
        }
    }
    return "Not set"
}

# Enable payment form (set past date)
if ($enablePaymentForm) {
    $pastDate = Get-PastDate
    Update-PaymentDate $pastDate
    Write-Host "Payment form ENABLED" -ForegroundColor Green
    Write-Host "PAYMENT_OPEN_DATE set to $pastDate (past date)" -ForegroundColor Cyan
    exit 0
}

# Disable payment form (set future date)
if ($disablePaymentForm) {
    $futureDate = Get-FutureDate
    Update-PaymentDate $futureDate
    Write-Host "Payment form DISABLED" -ForegroundColor Yellow
    Write-Host "PAYMENT_OPEN_DATE set to $futureDate (future date)" -ForegroundColor Cyan
    exit 0
}

# Show current status
if ($status -or (-not $enablePaymentForm -and -not $disablePaymentForm)) {
    $currentDate = Get-FormattedDate
    $paymentDate = Get-PaymentDate
    
    Write-Host "Payment Form Status" -ForegroundColor Cyan
    Write-Host "------------------" -ForegroundColor Cyan
    Write-Host "Current date:      $currentDate" -ForegroundColor White
    Write-Host "PAYMENT_OPEN_DATE: $paymentDate" -ForegroundColor White
    
    try {
        $paymentDateObj = [DateTime]::ParseExact($paymentDate, "yyyy-MM-dd", $null)
        $currentDateObj = [DateTime]::ParseExact($currentDate, "yyyy-MM-dd", $null)
        
        $isFormOpen = $currentDateObj -ge $paymentDateObj
        
        if ($isFormOpen) {
            Write-Host "Status: OPEN (date passed)" -ForegroundColor Green
            Write-Host "Form should show: PASSWORD SCREEN" -ForegroundColor Green
        } else {
            Write-Host "Status: CLOSED (future date)" -ForegroundColor Red
            Write-Host "Form should show: LOCKED MESSAGE" -ForegroundColor Red
            
            $daysDiff = ($paymentDateObj - $currentDateObj).Days
            Write-Host "Days until opening: $daysDiff" -ForegroundColor Yellow
        }
        
        Write-Host "`nTest Commands:" -ForegroundColor Cyan
        Write-Host "  .\test-payment-form.ps1 -enablePaymentForm  # Opens form (past date)" -ForegroundColor White
        Write-Host "  .\test-payment-form.ps1 -disablePaymentForm # Locks form (future date)" -ForegroundColor White
    } catch {
        Write-Host "Error: Invalid date format. Please use YYYY-MM-DD format." -ForegroundColor Red
    }
}