param (
    [switch]$check
)

$envFile = ".env"

# Check if .env file exists
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found in the current directory." -ForegroundColor Red
    exit 1
}

# Read the .env file content
$content = Get-Content $envFile

# Extract payment date
$paymentDate = $null
foreach ($line in $content) {
    if ($line -match '^PAYMENT_OPEN_DATE=(.*)') {
        $paymentDate = $matches[1] -replace '"', ''
        break
    }
}

if ($check) {
    # Perform date comparison check
    Write-Host "Environment Variable Test" -ForegroundColor Cyan
    Write-Host "---------------------------" -ForegroundColor Cyan

    Write-Host "PAYMENT_OPEN_DATE = $paymentDate" -ForegroundColor Yellow
    
    $currentDate = Get-Date
    $formattedCurrentDate = $currentDate.ToString("yyyy-MM-dd")
    
    Write-Host "Current Date = $formattedCurrentDate" -ForegroundColor Yellow
    
    if ($paymentDate) {
        try {
            $paymentDateObj = [DateTime]::ParseExact($paymentDate, "yyyy-MM-dd", $null)
            $result = $currentDate -ge $paymentDateObj
            
            Write-Host ""
            if ($result) {
                Write-Host "Result: Current date IS ON OR AFTER payment date" -ForegroundColor Green
                Write-Host "Form should be: UNLOCKED (password screen)" -ForegroundColor Green
            } else {
                Write-Host "Result: Current date IS BEFORE payment date" -ForegroundColor Red
                Write-Host "Form should be: LOCKED (unavailable message)" -ForegroundColor Red
            }
            
            # Calculate days difference
            $daysDiff = ($paymentDateObj - $currentDate).Days
            if ($daysDiff -gt 0) {
                Write-Host "Days until form opens: $daysDiff" -ForegroundColor Cyan
            } else {
                Write-Host "Form has been open for: $($daysDiff * -1) days" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "Error: Invalid date format in PAYMENT_OPEN_DATE. Use YYYY-MM-DD format." -ForegroundColor Red
        }
    } else {
        Write-Host "Error: PAYMENT_OPEN_DATE not found in .env file" -ForegroundColor Red
    }
} else {
    # Display env file values
    Write-Host "Environment Variables in .env file:" -ForegroundColor Cyan
    Write-Host "--------------------------------" -ForegroundColor Cyan
    
    foreach ($line in $content) {
        if (-not $line.StartsWith("#") -and $line.Trim() -ne "") {
            $parts = $line -split "=", 2
            if ($parts.Count -eq 2) {
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()
                Write-Host "$key = $value" -ForegroundColor Yellow
            }
        }
    }
}