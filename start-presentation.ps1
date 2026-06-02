param([switch]$Stop)

if ($Stop) {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "All services stopped." -ForegroundColor Yellow
    return
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Launching ZimVisit Presentation Suite..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "[1/3] Starting Traveler Portal (port 3003)..." -ForegroundColor Green
Start-Process -FilePath "npx.cmd" -ArgumentList "vite --port 3003 --host" -WorkingDirectory "$root\apps\traveler-portal" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Government Portal (port 3002)..." -ForegroundColor Green
Start-Process -FilePath "npx.cmd" -ArgumentList "vite --port 3002 --host" -WorkingDirectory "$root\apps\government-portal" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting Operator Dashboard (port 3001)..." -ForegroundColor Green
Start-Process -FilePath "npx.cmd" -ArgumentList "vite --port 3001 --host" -WorkingDirectory "$root\apps\operator-dashboard" -WindowStyle Normal

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " All portals launching!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host " Traveler Portal:    http://localhost:3003" -ForegroundColor White
Write-Host " Government Portal:  http://localhost:3002" -ForegroundColor White
Write-Host " Operator Dashboard: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host " Stop: .\start-presentation.ps1 -Stop" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Green
