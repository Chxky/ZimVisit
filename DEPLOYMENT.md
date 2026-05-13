# ZimVisit — Deployment Guide & Demo Credentials

## Quick Start

```powershell
cd zimvisit
.\demo.ps1
```

Wait ~30 seconds for all services to initialize.

---

## Access URLs

| Service | URL | Internal Port |
|---------|-----|---------------|
| **NestJS API** | http://localhost:3005 | 3000 |
| **AI Service** | http://localhost:8000 | 8000 |
| **Operator Dashboard** | http://localhost:3001 | 3001 |
| **Government Portal** | http://localhost:3002 | 3002 |
| **Nginx Gateway** | http://localhost → https://localhost | 80/443 |
| **PostgreSQL** | localhost:5432 | 5432 |
| **Redis** | localhost:6379 | 6379 |

---

## Login Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@zimvisit.com` |
| **Password** | `Test@1234` |
| **Role** | `system_admin` |

> Register additional users via `POST /api/v1/auth/register`
> Available roles: `traveler`, `operator`, `operator_agent`, `operator_admin`, `zta_official`, `zimra_official`, `system_admin`

---

## Demo Script Commands

| Command | Action |
|---------|--------|
| `.\demo.ps1` | Start all services, wait for API, register test user |
| `.\demo.ps1 -Stop` | Stop all services (keeps database data) |
| `.\demo.ps1 -Restart` | Restart all services |
| `.\demo.ps1 -Reset` | Full reset — wipes database and volumes |

---

## API Endpoints

All endpoints are prefixed with `/api/v1`. Example:
```
POST http://localhost:3005/api/v1/auth/login
```

### Authentication (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Get JWT tokens |
| POST | `/auth/refresh` | Refresh access token |

### Authenticated endpoints (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/bookings` | List / Create bookings |
| GET/PUT | `/bookings/:id` | Get / Update booking |
| POST | `/bookings/:id/cancel` | Cancel booking |
| GET | `/bookings/stats/revenue` | Revenue stats (gov only) |
| GET | `/bookings/stats/compliance` | Compliance stats (gov only) |
| GET/POST | `/inventory/tours` | List / Create tours |
| GET/PUT | `/inventory/tours/:id` | Get / Update tour |
| GET/POST | `/inventory/hotels` | List / Create hotels |
| GET/PUT | `/inventory/hotels/:id` | Get / Update hotel |
| GET | `/compliance/operator/:id` | Operator compliance |
| GET | `/compliance/leakage` | Revenue leakage (gov only) |
| GET | `/gds/flights/search` | Search flights (GDS) |
| GET | `/gds/flights/book` | Book flight (GDS) |
| GET/PUT | `/notifications` | List / Manage notifications |
| GET/POST | `/operators` | List / Create operators |
| GET/PUT | `/operators/:id` | Get / Update operator |
| GET | `/ai/fingerprinting/agents` | Agent fingerprinting |
| GET | `/ai/fingerprinting/stats` | Fingerprinting stats |
| GET/POST | `/users` | Admin user management |
| GET/PUT | `/users/:id` | Get / Update user |

---

## Architecture

```
Browser ──► Frontend (Nginx) ──proxy──► API (NestJS :3000)
                                              │
                                   ┌──────────┼──────────┐
                                   ▼          ▼          ▼
                              PostgreSQL    Redis    AI Service
                              (:5432)      (:6379)    (:8000)
```

- Frontend containers (operator-dashboard, government-portal) each run Nginx
- Nginx proxies `/api/` requests to `http://api:3000` internally
- The API is exposed on host port 3005 to avoid port conflicts
- AI service runs separately (FastAPI + Python)

---

## Known Issues

| Issue | Cause | Workaround |
|-------|-------|------------|
| Port 3000 conflict | Local Node process uses 3000 | Already remapped to 3005 |
| Self-signed cert warning | Dev certs not trusted by browser | Click "Advanced" → "Proceed" in browser, or trust the CA |

---

## File Structure (key files)

```
zimvisit/
├── demo.ps1              # One-command demo script
├── docker-compose.yml    # All service definitions
├── docker-compose.yml    # All service definitions
├── nginx.conf            # Main gateway config (SSL, uses self-signed certs)
├── certs/                # Generated SSL certificates (gitignored)
├── scripts/
│   └── gen-certs.ps1     # Self-signed certificate generator
├── .env.example          # Environment template
├── database/
│   └── schema.sql        # PostgreSQL schema (not used — TypeORM handles it)
├── apps/
│   ├── backend/
│   │   ├── nestjs/       # NestJS API (TypeScript)
│   │   └── ai-service/   # FastAPI AI service (Python)
│   ├── operator-dashboard/  # React frontend (:3001)
│   ├── government-portal/   # React frontend (:3002)
│   └── traveler-app/        # Flutter mobile app
└── DEPLOYMENT.md         # This file
```

---

## Docker Compose Services

| Service | Container Name | Image | Depends On |
|---------|---------------|-------|------------|
| postgres | zimvisit-db | postgres:15-alpine | — |
| redis | zimvisit-redis | redis:7-alpine | — |
| api | zimvisit-api | zimvisit-api (custom) | postgres, redis (healthy) |
| ai-service | zimvisit-ai | zimvisit-ai-service (custom) | — |
| operator-dashboard | zimvisit-operator | zimvisit-operator-dashboard (custom) | api |
| government-portal | zimvisit-gov | zimvisit-government-portal (custom) | api |
| nginx | zimvisit-nginx | nginx:alpine | api, operator-dashboard, government-portal |

---

## Environment Variables (docker-compose)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | production | API environment |
| `DB_DRIVER` | postgres | Database driver |
| `DB_HOST` | postgres | Database host |
| `DB_PORT` | 5432 | Database port |
| `DB_USERNAME` | zimvisit | Database user |
| `DB_PASSWORD` | zimvisit_secret | Database password |
| `DB_DATABASE` | zimvisit | Database name |
| `REDIS_HOST` | redis | Redis host |
| `AI_SERVICE_URL` | http://ai-service:8000 | AI service URL |
| `JWT_SECRET` | change-in-production | JWT signing secret |

> **IMPORTANT:** Change `JWT_SECRET` and `DB_PASSWORD` before any production deployment.

---

## First Time Setup (if building from scratch)

```powershell
# 1. Clone or copy the project
cd zimvisit

# 2. Start with Docker
docker compose up -d --build

# 3. Register a test user
$body = @{ email = "admin@zimvisit.com"; fullName = "Admin User"; password = "Test@1234"; role = "system_admin" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3005/api/v1/auth/register" -Method Post -Body $body -ContentType "application/json"

# 4. Verify login
$body = @{ email = "admin@zimvisit.com"; password = "Test@1234" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3005/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json"

# 5. Open browser
start http://localhost:3001
start http://localhost:3002
```
