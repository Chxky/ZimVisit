# ZimVisit — Zimbabwe Tourism Booking & Government Compliance Platform

A comprehensive three-sided marketplace capturing an estimated **US$150M+ in annual tourism revenue** currently lost through non-compliant offshore ticketing.

> **72% of travel agencies operate outside the official IATA Billing and Settlement Plan (BSP)**, funneling foreign currency out of Zimbabwe. ZimVisit makes compliance the path of least resistance.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAVELER APP (Flutter)                     │
│  ZimPass QR Itinerary · Name Your Budget · Offline-First     │
├───────────────────────┬─────────────────────────────────────┤
│  OPERATOR DASHBOARD   │    GOVERNMENT PORTAL                │
│  (React + Ant Design) │    (React + Ant Design)             │
│  · BSP Compliance     │    · Live Revenue Dashboard         │
│  · Inventory Mgmt     │    · Operator Compliance Grid        │
│  · Agent Fingerprint  │    · AI Revenue Forecaster           │
│  · QR Code Gen        │    · Risk Analytics                  │
├───────────────────────┴─────────────────────────────────────┤
│                    API GATEWAY (NestJS)                       │
│  Auth · Bookings · Payments · GDS · Compliance · Inventory   │
├─────────────────────────────────────────────────────────────┤
│              AI ENGINE (FastAPI / Python)                     │
│  Agent Fingerprinting · Revenue Forecasting · Risk Scoring   │
├─────────────────────────────────────────────────────────────┤
│              DATA LAYER (PostgreSQL + Redis)                  │
│  Users · Bookings · Payments · Compliance · Revenue Log      │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Mobile App | **Flutter (Dart)** | Cross-platform traveler app |
| Web Panels | **React + TypeScript + Ant Design** | Operator & Government dashboards |
| Backend | **NestJS (Node.js/TypeScript)** | Modular REST API |
| AI/ML | **FastAPI (Python)** | Fingerprinting & forecasting |
| Database | **PostgreSQL 15** | Transactional data & compliance |
| Cache | **Redis** | Session management & caching |
| Container | **Docker + Docker Compose** | Local & production deployment |
| Orchestration | **Kubernetes** (configs provided) | Production scaling |
| Travel APIs | **Amadeus + Travelport** | GDS flight aggregation |

## Project Structure

```
zimvisit/
├── apps/
│   ├── backend/
│   │   ├── nestjs/           # NestJS API (port 3000)
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── auth/           # JWT auth, registration
│   │   │   │   │   ├── users/          # User profiles
│   │   │   │   │   ├── bookings/       # Booking lifecycle
│   │   │   │   │   ├── payments/       # Paynow, EcoCash, Stripe
│   │   │   │   │   ├── inventory/      # Tours & hotels
│   │   │   │   │   ├── compliance/     # BSP engine, levy calc
│   │   │   │   │   ├── gds/            # Amadeus/Travelport
│   │   │   │   │   └── notifications/  # In-app alerts
│   │   │   │   ├── common/             # Guards, interceptors
│   │   │   │   └── config/             # DB, Swagger
│   │   │   ├── test/
│   │   │   ├── Dockerfile
│   │   │   └── package.json
│   │   └── ai-service/       # Python AI microservice (port 8000)
│   │       ├── app/
│   │       │   ├── models/             # Fingerprinting, Forecasting
│   │       │   ├── routes/             # API endpoints
│   │       │   └── schemas/            # Pydantic models
│   │       ├── tests/
│   │       ├── Dockerfile
│   │       └── requirements.txt
│   ├── traveler-app/         # Flutter mobile app
│   │   ├── lib/
│   │   │   ├── features/     # Auth, Search, Bookings, ZimPass
│   │   │   ├── services/     # API, Auth, Storage
│   │   │   └── widgets/
│   │   └── pubspec.yaml
│   ├── operator-dashboard/   # React dashboard (port 3001)
│   │   ├── src/
│   │   │   ├── pages/        # Dashboard, Bookings, Inventory, Compliance, AI
│   │   │   └── components/   # Layout, shared components
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── government-portal/    # React portal (port 3002)
│       ├── src/
│       │   ├── pages/        # Revenue Dashboard, Operators, Risk Forecast
│       │   └── components/
│       ├── package.json
│       └── vite.config.ts
├── database/
│   └── schema.sql            # Full PostgreSQL schema
├── kubernetes/               # K8s deployment configs
├── docs/
│   ├── api.md               # Comprehensive API documentation
│   └── strategy-brief.md    # National adoption strategy
├── docker-compose.yml
├── .env.example
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- Flutter SDK 3+
- Docker & Docker Compose (optional)
- PostgreSQL 15+ (or Docker)

### Quick Start (All Services)

```bash
# Clone and enter directory
cd zimvisit

# Start infrastructure (PostgreSQL, Redis)
docker-compose up -d postgres redis

# Install all dependencies
npm run setup

# Start all development servers
npm run dev
```

### Manual Setup (Per Service)

#### 1. Database

```bash
# Option A: Docker
docker run -d --name zimvisit-db \
  -e POSTGRES_DB=zimvisit \
  -e POSTGRES_USER=zimvisit \
  -e POSTGRES_PASSWORD=zimvisit_secret \
  -p 5432:5432 \
  postgres:15-alpine

# Option B: Apply schema directly
psql -h localhost -U zimvisit -d zimvisit -f database/schema.sql
```

#### 2. Backend API

```bash
cd apps/backend/nestjs
cp .env.example .env
# Edit .env with your settings
npm install
npm run start:dev
# API running at http://localhost:3000/api/v1
# Swagger docs at http://localhost:3000/api/docs
```

#### 3. AI Service

```bash
cd apps/backend/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Running at http://localhost:8000
```

#### 4. Operator Dashboard

```bash
cd apps/operator-dashboard
npm install
npm run dev
# Running at http://localhost:3001
```

#### 5. Government Portal

```bash
cd apps/government-portal
npm install
npm run dev
# Running at http://localhost:3002
```

#### 6. Flutter Traveler App

```bash
cd apps/traveler-app
flutter pub get
flutter run
```

### Docker Compose (Full Stack)

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f api ai-service

# Stop everything
docker-compose down
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | JWT signing key |
| `DB_HOST` | PostgreSQL host |
| `PAYNOW_INTEGRATION_KEY` | Paynow payment key |
| `ECOCHASH_MERCHANT_ID` | EcoCash merchant ID |
| `AMADEUS_API_KEY` | Amadeus flight API key |
| `TOURISM_LEVY_RATE` | ZTA levy rate (default 2%) |
| `VAT_RATE` | VAT rate (default 15%) |
| `AI_SERVICE_URL` | AI microservice URL |

## Cloud Deployment (AWS / GCP)

### Production Architecture

```
CloudFront / CDN
    ├── traveler.zimvisit.co.zw → Flutter Web (S3/CloudFront)
    ├── admin.zimvisit.co.zw    → Operator Dashboard (S3/CloudFront)
    ├── gov.zimvisit.co.zw      → Government Portal (S3/CloudFront)
    └── api.zimvisit.co.zw      → ALB → ECS Fargate (NestJS)
                                        └── ECS Fargate (AI Service)
                                              └── RDS PostgreSQL
                                              └── ElastiCache Redis
```

### Kubernetes Deployment

```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/
```

See `kubernetes/` directory for complete deployment manifests.

## API Documentation

Full OpenAPI/Swagger documentation is available at:

- **Development:** http://localhost:3000/api/docs
- **Production:** https://api.zimvisit.co.zw/api/docs

See [docs/api.md](docs/api.md) for detailed endpoint reference.

## Core Features

### Pillar A: Traveler Marketplace (Flutter)
- **ZimPass** — Single QR-coded digital pass for entire trip
- **Name Your Budget** — AI-powered reverse auction
- **Offline-first** — Works in low-bandwidth areas (national parks)
- **Local Payments** — EcoCash, Paynow + Visa/Mastercard

### Pillar B: Operator Command Center (React)
- **BSP/Levy Compliance Engine** — Auto-calculates & remits taxes/levy at POS
- **AI Agent Fingerprinting** — "Proof-of-Process" behavior analysis
- **Dynamic Inventory** — Tours, hotels, QR generation
- **Staff Management** — Role-based access, activity monitoring

### Pillar C: Government Portal (React)
- **Live Revenue Dashboard** — Real-time national tourism revenue
- **Compliance Grid** — Color-coded operator compliance (Green/Amber/Red)
- **AI Revenue Forecaster** — Predicts leakage & high-risk operators
- **BSP Comparison** — Visualizes revenue capture rate vs official IATA data

## Testing

```bash
# Backend tests
cd apps/backend/nestjs && npm test

# AI service tests
cd apps/backend/ai-service && pytest

# E2E tests
cd apps/backend/nestjs && npm run test:e2e
```

## License

Proprietary — ZTA / Government of Zimbabwe
