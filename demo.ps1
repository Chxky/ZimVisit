param(
    [switch]$Stop,
    [switch]$Restart
)

if ($Stop -or $Restart) {
    docker compose down -v
    if (-not $Restart) { return }
}

if ((docker compose ps -q 2>$null).Length -eq 0 -or $Restart) {
    Write-Host "=== Building and starting all services ===" -ForegroundColor Cyan
    docker compose up -d --build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "First build failed, retrying individual services..." -ForegroundColor Yellow
        docker compose up -d postgres redis
        Start-Sleep -Seconds 5
        docker compose up -d ai-service
        docker compose up -d api --build
        Start-Sleep -Seconds 5
        docker compose up -d operator-dashboard government-portal nginx --build
    }
}

Write-Host "`n=== Waiting for services to be ready ===" -ForegroundColor Cyan
Start-Sleep -Seconds 5

$apiUp = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3005/api/v1/auth/login" -Method Post -Body '{"email":"admin@zimvisit.com","password":"Test@1234"}' -ContentType "application/json" -UseBasicParsing -DisableKeepAlive
        if ($r.StatusCode -eq 201 -or $r.StatusCode -eq 200) { $apiUp = $true; break }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if (-not $apiUp) {
    Write-Host "`nRegistering test user..." -ForegroundColor Yellow
    try {
        $body = @{ email = "admin@zimvisit.com"; fullName = "Admin User"; password = "Test@1234"; role = "system_admin" } | ConvertTo-Json
        Invoke-RestMethod -Uri "http://localhost:3005/api/v1/auth/register" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing | Out-Null
    } catch { }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ZimVisit is running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  API (NestJS):    http://localhost:3005"
Write-Host "  AI Service:      http://localhost:8000"
Write-Host "  Operator Dash:   http://localhost:3001"
Write-Host "  Gov Portal:      http://localhost:3002"
Write-Host "  Nginx:           http://localhost"
Write-Host ""
Write-Host "  Login: admin@zimvisit.com / Test@1234"
Write-Host ""
Write-Host "  Stop:  .\demo.ps1 -Stop"
Write-Host "========================================" -ForegroundColor Green
