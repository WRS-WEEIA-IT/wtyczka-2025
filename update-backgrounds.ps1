$files = Get-ChildItem -Path "src\app\" -Recurse -Include "*.tsx" -File

foreach ($file in $files) {
    # Read the content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace the background classes
    $newContent = $content -replace 'min-h-screen bg-black', 'min-h-screen'
    $newContent = $newContent -replace 'bg-black border-b', 'border-b'
    
    # Write the updated content
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Background update complete!"
