<div align="center">
  <img src="./apps/traveler-portal/public/golden-lion-qr.png" alt="ZimVisit Logo" width="200" height="200" />
  <h1>ZimVisit: The National Tourism Booking & Compliance Platform</h1>
  <p><b>Government-Grade Security | AI-Powered Audit Engines | Real-Time BSP Integration</b></p>
</div>

---

## 🌍 The Opportunity & The Problem

Zimbabwe’s tourism sector generates **US$500M+ annually**—yet **US$150M+ is lost** through non-compliant, offshore ticketing. Currently, an estimated **72% of travel agencies** operate outside the official IATA Billing and Settlement Plan (BSP), funneling foreign currency earnings out of the formal financial system. 

The primary root causes of this leakage include offshore booking platforms bypassing ZIMRA entirely, shell agencies utilizing "token registrations" to hide ownership, and cash-based manual reporting that leads to 12–18 month audit lag times.

## 🚀 The ZimVisit Solution

**ZimVisit** is a revolutionary, three-sided digital marketplace explicitly engineered to eliminate revenue leakage by making compliance the path of least resistance. We unify travelers, tour operators, and government auditors into a single ecosystem powered by Advanced AI and secure payment protocols.

### Key Value Propositions by Stakeholder:

#### 1. For the Government (ZTA & ZIMRA)
* **Real-Time Revenue Dashboard:** Instantly track national tourism revenue and levy collection with a drill-down matrix down to individual operators.
* **AI Agent Fingerprinting & Forecaster:** An integrated ML model learns behavioral baselines (booking velocity, POS origins) to instantly flag anomalies and detect shell agencies using Isolation Forest techniques.
* **Automated Audit Grid:** Live color-coded operator compliance (Green/Amber/Red), transitioning audits from manual to continuous and proactive.

#### 2. For the Operators
* **Zero-Friction BSP/Levy Engine:** Auto-calculates and remits the ZTA tourism levy (2%), VAT (15%), and BSP processing fee (3%) directly at the point of sale. 
* **Dynamic Inventory Control:** Effortlessly manage tours, hotels, and live availability via an intuitive Ant-Design dashboard.

#### 3. For the Travelers
* **ZimPass QR:** A single, offline-capable digital pass for an entire journey—from flights to remote safari lodges.
* **Military-Grade E2E Encryption:** All user data, authentication states, and bookings are heavily encrypted in-browser using **AES-256-GCM**, aligning strictly with defense and government privacy standards.
* **Localized Payments:** Full integration with EcoCash, Paynow, and major international gateways (Visa/Mastercard).

---

## 📊 Analytics & Impact Projections (3-Year Forecast)

ZimVisit’s data-driven approach is projected to recover unprecedented levels of the tourism economy:

| Metric | Current State | Year 1 Projection | Year 3 Target |
|--------|--------------|-------------------|---------------|
| **Revenue Capture Rate** | 28% | 68% | **95%** |
| **Tax/Levy Collection** | US$30M | US$48M | **US$80M+** |
| **Audit Cycle Lag** | 12-18 months | Real-time | **Predictive** |
| **Leakage Eliminated** | N/A | US$48M Recovered | **US$142M Recovered** |
| **Active Formal Operators**| ~150 | 300 | **480+** |

*Based on independent compliance evaluations and offshore BSP comparisons over the last fiscal quarter.*

---

## 🛠 Technology Stack

ZimVisit relies on a modular, highly scalable, cloud-native architecture. 

* **Web Dashboards:** React.js, TypeScript, Ant Design, Zustand (State Management with AES-256-GCM storage).
* **Mobile/Client App:** Flutter (Dart) for offline-first capabilities.
* **Backend API & Microservices:** NestJS (Node.js/TypeScript) serving 90+ scalable REST endpoints.
* **AI/ML Engine:** FastAPI (Python) running Scikit-Learn for Isolation Forest anomaly detection and LSTM time-series forecasting.
* **Database & Caching:** PostgreSQL 15, Redis.
* **Infrastructure:** Docker, Docker Compose, Kubernetes.

---

## ⚙️ Running Locally

The entire monorepo can be executed locally for presentation and development purposes. 

**Prerequisites:** Node.js (v18+), npm.

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables:**
   Update your \`.env.local\` file to include your API keys (e.g., \`GEMINI_API_KEY\`).

3. **Start the Portals:**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   The ecosystem will launch:
   - **Traveler Portal** (End-User App & Booking Engine)
   - **Operator Dashboard** (Inventory & Payment Control)
   - **Government Portal** (Compliance Grid & Revenue Audits)

---
*ZimVisit — Capturing Zimbabwe's tourism revenue, one booking at a time.*
