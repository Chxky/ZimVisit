# ZimVisit - National Tourism Digitization & Compliance Platform

**Copyright (c) 2026 Pardon Mahara, Nextlytech (nextly@zohomail.com)**

---

## 🌍 The Golden Pitch: Zimbabwe's Tourism Sector Transformation

Zimbabwe's tourism sector generates **US$500M+ annually** — yet an estimated **US$150M+ is lost** through non-compliant, offshore ticketing. Currently, nearly 72% of travel agencies operate outside the official IATA Billing and Settlement Plan (BSP), funneling foreign currency earnings out of the formal financial system and bypassing the 2% statutory ZTA tourism levy.

**ZimVisit** is a revolutionary three-sided digital ecosystem that makes compliance the path of least resistance. By integrating tourists, operators, and the government into a single digital pipeline, ZimVisit mathematically prevents offshore levy evasion, captures revenue that leaks through fragmented booking systems, and modernizes Zimbabwe's tourism infrastructure.

---

## 🚀 Live Portals

ZimVisit is deployed and live across three distinct micro-frontends:

* 🏢 **Government Portal (ZTA Command Center):** [https://government-portal-omega.vercel.app](https://government-portal-omega.vercel.app)
* 💼 **Operator Dashboard:** [https://operator-dashboard-two.vercel.app](https://operator-dashboard-two.vercel.app)
* 🌍 **Traveler Portal:** [https://traveler-portal-ebon.vercel.app](https://traveler-portal-ebon.vercel.app)

---

## 🏗 System Architecture: A Three-Sided Marketplace

```text
                     ┌─────────────────────┐
                     │   GOVERNMENT (ZTA)  │
                     │  Live Revenue Board │
                     │  Compliance Grid    │
                     │  AI Risk Forecaster │
                     └──────────┬──────────┘
                                │
     ┌──────────────────────────┼──────────────────────────┐
     │                          │                          │
     ▼                          ▼                          ▼
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  TRAVELERS   │     │   OPERATORS      │     │   GOVERNMENT     │
│  (React Web) │◄───►│   (React/AntD)   │◄───►│   (React/AntD)   │
│              │     │                  │     │                  │
│ • ZimPass QR │     │ • BSP Compliance │     │ • Revenue Dashboard│
│ • Itineraries│     │ • AI Fingerprint │     │ • Compliance Grid  │
│ • Offline    │     │ • Inventory Mgmt │     │ • AI Forecaster    │
│ • EcoCash    │     │ • Auto-Remittance│     │ • Risk Analytics   │
└──────┬───────┘     └────────┬─────────┘     └────────┬─────────┘
       │                      │                        │
       └──────────────────────┼────────────────────────┘
                              │
                     ┌────────┴────────┐
                     │   API GATEWAY   │
                     │   (NestJS)      │
                     └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────────┐
        │PostgreSQL│   │  Redis   │   │  AI Engine   │
        │          │   │          │   │  (FastAPI)   │
        └──────────┘   └──────────┘   └──────────────┘
```

---

## ⚙️ Key Components

### 1. Traveler Portal
A frictionless public-facing application where tourists browse, plan, and book certified lodges, flights, and activities across Zimbabwe. All transactions processed here are automatically compliant, capturing levies exactly at the point of sale.

### 2. Operator Dashboard
A dedicated interface for registered tourism operators (lodges, helicopter flights, charter airlines).
* **Automated Compliance:** Integration with payment gateways (Paynow, ecoCash, GDS) executes an automated 2% levy split at the source, sending remittances directly to Reserve Bank of Zimbabwe (RBZ) custody accounts.
* **Dynamic Inventory:** Real-time tour and hotel availability management.

### 3. Government Portal (ZTA Oversight)
A command center for the Zimbabwe Tourism Authority to enforce regulations in real time.
* **National Analytics:** Live revenue dashboards with drill-down capabilities.
* **Compliance Grid:** Color-coded operator compliance monitoring.

### 4. AI-Powered Intelligence
* **Behavioral Trust Rating ("Agent Fingerprint"):** Detects shell accounts and offshore ticket splitting using Isolation Forest anomaly detection.
* **BSP Delta Gap Analysis & Forecasting:** LSTM time-series forecasting predicts national tourism revenue and flags leakage risks before manual audits.

---

## 🛠 Technology Stack

* **Frontend Portals:** React, Vite, TailwindCSS, Ant Design
* **Mobile App:** Flutter (Dart) for offline-capable traveler apps
* **Backend:** NestJS (Node.js/TypeScript) REST APIs
* **Database & Caching:** PostgreSQL 15 and Redis
* **AI Engine:** FastAPI (Python) running scikit-learn models
* **Orchestration:** Docker, Docker Compose, NGINX

---

## 💻 Running the Project Locally

The entire ZimVisit ecosystem is fully containerized. You can spin up the complete stack (Backend API, AI Service, Redis, PostgreSQL) using the provided PowerShell script.

1. Ensure **Docker Desktop** is installed and running.
2. Open PowerShell as Administrator.
3. Run the demo script:
   ```powershell
   .\demo.ps1
   ```
4. The script will automatically build all local containers, seed the database, and spin up the backend APIs. 

---

## 📄 License & Copyright

**Copyright (c) 2026 Pardon Mahara, Nextlytech**
Email: nextly@zohomail.com

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
