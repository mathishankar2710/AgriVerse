$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts"
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if ($content -match "அக்ரிவர்ஸ்") {
        $newContent = $content -replace "அக்ரிவர்ஸ்", "அக்ரி ஏஜென்ட்"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "Updated Tamil brand name: $($file.FullName)"
    }
}
Write-Host "Done."
