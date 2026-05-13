param(
    [switch]$Force
)

$certsDir = Join-Path (Split-Path $PSScriptRoot -Parent) "certs"
$crtPath = Join-Path $certsDir "zimvisit.crt"
$keyPath = Join-Path $certsDir "zimvisit.key"

if ((Test-Path $crtPath) -and (Test-Path $keyPath) -and (-not $Force)) {
    Write-Host "SSL certificates already exist at $certsDir. Use -Force to regenerate." -ForegroundColor Yellow
    return
}

if (-not (Test-Path $certsDir)) {
    New-Item -ItemType Directory -Path $certsDir -Force | Out-Null
}

Write-Host "=== Generating self-signed SSL certificates ===" -ForegroundColor Cyan
Write-Host "Using Docker Alpine container (OpenSSL)..." -ForegroundColor Gray

docker run --rm -v "${certsDir}:/certs" alpine:latest sh -c "
    apk add --no-cache openssl >/dev/null 2>&1
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout /certs/zimvisit.key \
        -out /certs/zimvisit.crt \
        -subj '/CN=zimvisit.co.zw/O=ZimVisit/C=ZW' \
        -addext 'subjectAltName=DNS:zimvisit.co.zw,DNS:admin.zimvisit.co.zw,DNS:gov.zimvisit.co.zw,DNS:localhost'
"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Certificates generated:" -ForegroundColor Green
    Write-Host "  $crtPath" -ForegroundColor Green
    Write-Host "  $keyPath" -ForegroundColor Green
} else {
    Write-Host "Failed to generate certificates." -ForegroundColor Red
    exit 1
}
