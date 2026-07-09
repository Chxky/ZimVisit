param([Switch]$Stop)

$root = $PSScriptRoot

if ($Stop) {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process | Where-Object { $_.ProcessName -like "*python*" -and $_.CommandLine -like "*uvicorn*" } | Stop-Process -Force 2>$null
    Write-Host "`nAll services stopped." -ForegroundColor Yellow
    return
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ZimVisit — Investor Demo Suite" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Step 1: Clean old SQLite database so seed is fresh
$dbPath = "$root\apps\backend\nestjs\zimvisit.db"
if (Test-Path $dbPath) {
    Remove-Item $dbPath -Force
    Write-Host "[✓] Removed old database" -ForegroundColor DarkYellow
}

# Step 2: Start NestJS API server
Write-Host "[1/4] Starting API server..." -ForegroundColor Green
$apiJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location -LiteralPath $dir
    npx nest start 2>&1 | Out-Null
} -ArgumentList "$root\apps\backend\nestjs"

# Wait for API to be ready
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health" -UseBasicParsing -TimeoutSec 2
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch { }
}
if (-not $ready) {
    Write-Host "[!] API didn't start in time. Try again." -ForegroundColor Red
    exit 1
}
Write-Host "[2/4] API ready on http://localhost:3000" -ForegroundColor Green

# Step 3: Seed demo data
Write-Host "[3/4] Seeding demo data..." -ForegroundColor Green
$seedJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location -LiteralPath $dir
    npx ts-node src/seed.ts
} -ArgumentList "$root\apps\backend\nestjs"
$seedResult = $seedJob | Receive-Job -Wait -AutoRemoveJob
Write-Host $seedResult

# Step 4: Start frontends
Write-Host "[4/4] Launching frontends..." -ForegroundColor Green
Start-Process -FilePath "npx.cmd" -ArgumentList "vite --port 3003 --host" -WorkingDirectory "$root\apps\traveler-portal" -WindowStyle Normal
Start-Sleep -Seconds 2
Start-Process -FilePath "npx.cmd" -ArgumentList "vite --port 3002 --host" -WorkingDirectory "$root\apps\government-portal" -WindowStyle Normal
Start-Sleep -Seconds 2
Start-Process -FilePath "npx.cmd" -ArgumentList "vite --port 3001 --host" -WorkingDirectory "$root\apps\operator-dashboard" -WindowStyle Normal
Start-Sleep -Seconds 3

# Open browsers
Start-Process "http://localhost:3003"
Start-Sleep -Seconds 1
Start-Process "http://localhost:3002"
Start-Sleep -Seconds 1
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  ZimVisit Investor Demo is LIVE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Portal                URL" -ForegroundColor White
Write-Host "  ─────────────────────────────────────────" -ForegroundColor White
Write-Host "  Traveler Portal (B2C): http://localhost:3003" -ForegroundColor White
Write-Host "  Gov Portal (B2G):      http://localhost:3002" -ForegroundColor White
Write-Host "  Operator Dashboard:    http://localhost:3001" -ForegroundColor White
Write-Host "  API (Swagger):         http://localhost:3000/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "  Demo Credentials" -ForegroundColor Yellow
Write-Host "  ─────────────────────────────────────────" -ForegroundColor Yellow
Write-Host "  Admin:    admin@zimvisit.com / demo123" -ForegroundColor Yellow
Write-Host "  Operator: operator@wildhorizons.co.zw / demo123" -ForegroundColor Yellow
Write-Host "  Traveler: traveler@gmail.com / demo123" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Key Demo Flows" -ForegroundColor Cyan
Write-Host "  ─────────────────────────────────────────" -ForegroundColor Cyan
Write-Host "  1. Gov Portal — Compliance Grid, Revenue Dashboard, AI Forecaster" -ForegroundColor Cyan
Write-Host "  2. Operator Dashboard — Bookings, Inventory, AI Fingerprinting" -ForegroundColor Cyan
Write-Host "  3. Traveler Portal — Browse tours, book, ZimPass QR" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Stop: .\start-presentation.ps1 -Stop" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Green
