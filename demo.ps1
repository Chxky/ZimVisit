param(
    [switch]$Stop,
    [switch]$Restart,
    [switch]$Reset
)

if ($Stop -or $Restart -or $Reset) {
    docker compose down
    if ($Reset) { docker compose down -v }
    if ($Stop) { Write-Host "Services stopped." -ForegroundColor Yellow; return }
}

# Ensure SSL certs exist
$certsDir = Join-Path $PSScriptRoot "certs"
if (-not (Test-Path (Join-Path $certsDir "zimvisit.crt"))) {
    Write-Host "=== Generating SSL certificates ===" -ForegroundColor Cyan
    & "$PSScriptRoot\scripts\gen-certs.ps1"
}

Write-Host "=== Starting ZimVisit ===" -ForegroundColor Cyan

if ((docker compose ps -q 2>$null).Length -eq 0) {
    docker compose up -d postgres redis
    Start-Sleep -Seconds 3
    docker compose up -d ai-service api
    Start-Sleep -Seconds 10
    docker compose up -d nginx
    Start-Sleep -Seconds 2
    docker compose up -d operator-dashboard government-portal
}

Write-Host "`n=== Waiting for API ===" -ForegroundColor Cyan
$apiUp = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3005/api/v1/auth/login" -Method Post -Body '{"email":"admin@zimvisit.com","password":"Test@1234"}' -ContentType "application/json" -UseBasicParsing -DisableKeepAlive
        if ($r.StatusCode -eq 201 -or $r.StatusCode -eq 200) { $apiUp = $true; break }
    } catch { Start-Sleep -Seconds 2 }
}

if (-not $apiUp) {
    try {
        $body = @{ email = "admin@zimvisit.com"; fullName = "Admin User"; password = "Test@1234"; role = "system_admin" } | ConvertTo-Json
        Invoke-RestMethod -Uri "http://localhost:3005/api/v1/auth/register" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing | Out-Null
    } catch { }
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  ZimVisit is running!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  API (NestJS):    http://localhost:3005"
Write-Host "  AI Service:      http://localhost:8000"
Write-Host "  Operator Dash:   http://localhost:3001"
Write-Host "  Gov Portal:      http://localhost:3002"
Write-Host ""
Write-Host "  Gateway:         http://localhost"
Write-Host "  Gateway (SSL):   https://localhost"
Write-Host ""
Write-Host "  Login:    admin@zimvisit.com"
Write-Host "  Password: Test@1234"
Write-Host ""
Write-Host "  Stop:     .\demo.ps1 -Stop"
Write-Host "  Restart:  .\demo.ps1 -Restart"
Write-Host "  Reset DB: .\demo.ps1 -Reset"
Write-Host "============================================" -ForegroundColor Green
