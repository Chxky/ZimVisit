# ZimVisit: Strategy Brief for National Adoption

## Zimbabwe Tourism Revenue Recovery Platform

**Date:** May 2026
**Prepared for:** Zimbabwe Tourism Authority (ZTA), Zimbabwe Revenue Authority (ZIMRA), Ministry of Tourism

---

## Executive Summary

Zimbabwe's tourism sector generates an estimated **US$500M+ annually**, yet **US$150M+ is lost** through non-compliant, offshore ticketing. An estimated **72% of travel agencies operate outside the official IATA Billing and Settlement Plan (BSP)**, funneling foreign currency earnings out of the formal financial system.

**ZimVisit** is a comprehensive tourism booking and compliance platform designed to plug this leakage. It creates a three-sided marketplace that:

1. **Empowers travelers** with a seamless booking experience
2. **Enables operators** with compliance-as-a-service tools
3. **Provides the state** with real-time visibility into all tourism transactions

---

## The Problem: US$150M+ Annual Revenue Leakage

### Root Causes

| Issue | Impact | Evidence |
|-------|--------|----------|
| **Offshore booking platforms** | Revenue bypasses ZIMRA | 72% of agencies book outside BSP |
| **Token registrations** | Shell agencies hide real ownership | AI detection needed |
| **Cash-based transactions** | No digital trail | Tour operators, guides, lodges |
| **Manual compliance reporting** | Inconsistent, fraud-prone | Current ZTA audit cycle: 12-18 months |
| **No unified booking system** | Fragmented data | No single source of tourism truth |

### Financial Impact

| Metric | Current | Target with ZimVisit |
|--------|---------|---------------------|
| Annual tourism revenue | ~US$500M | ~US$650M (formalized) |
| Revenue capture rate | ~28% (IATA BSP) | ~95% (ZimVisit + mandate) |
| Tax collection (VAT/Levy) | ~US$30M | ~US$80M |
| Lost foreign currency | US$150M+ | near-zero leakage |
| Audit latency | 12-18 months | Real-time |

---

## The Solution: ZimVisit Platform

### Three-Sided Marketplace Architecture

```
TRAVELERS                    OPERATORS                     GOVERNMENT
    │                           │                              │
    ▼                           ▼                              ▼
┌──────────┐              ┌────────────┐              ┌──────────────┐
│ Flutter  │              │  Operator  │              │  Government  │
│   App    │ ◄──────────► │ Command    │ ◄──────────► │  Oversight   │
│ Web/Mob  │              │  Center    │              │  Portal      │
└────┬─────┘              └─────┬──────┘              └──────┬───────┘
     │                          │                            │
     └──────────────────────────┼────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   ZimVisit Platform   │
                    │  (NestJS + PostgreSQL)│
                    ├───────────────────────┤
                    │  Compliance Engine    │
                    │  BSP Integration      │
                    │  Levy/VAT Auto-Deduct │
                    │  Real-time Reporting  │
                    │  AI Fingerprinting    │
                    └───────────────────────┘
```

### Core Pillars

#### Pillar A: Traveler-Facing Marketplace
- **ZimPass Unified Itinerary:** Single QR-coded digital pass for flights, hotels, tours, transfers
- **Name Your Budget:** AI-powered reverse auction connects travelers to curated packages
- **Offline-capable Flutter app** works in low-bandwidth areas (Hwange, Mana Pools, Gonarezhou)
- **Local payments** (EcoCash, Paynow) + International (Visa/Mastercard via Stripe)

#### Pillar B: Operator Command Center
- **Automated BSP/Levy Compliance Engine:** One-click GDS integration routes all bookings through approved financial rails
- **"Proof-of-Process" AI Agent Fingerprinting:** Machine learning model that:
  - Learns each agent's behavioral baseline (speed, volume, destinations, time patterns)
  - Flags anomalies: high velocity, unusual destinations, off-hours booking
  - Identifies "token registrations" and compromised accounts
- **Dynamic inventory management** with QR code generation for tours/activities
- **Integrated calendar, staff roles, real-time notifications**

#### Pillar C: Government Oversight Portal
- **Live National Revenue Dashboard:** "Google Analytics for Zimbabwe Tourism"
  - Real-time transaction volume, tax collected, levy remitted
  - Side-by-side comparison: ZimVisit revenue vs IATA BSP data
  - Visual "Revenue Capture Rate" metric
- **Operator Compliance Grid:**
  - Green = Fully compliant (>90%)
  - Amber = Approaching issues (60-90%)
  - Red = Non-compliant (<60%)
- **AI Revenue & Risk Forecaster:**
  - Quarterly leakage predictions
  - High-risk operator identification
  - Confidence-scored recommendations

---

## Mechanism for Success: The ZTA Compliance Mandate

### Phase 1: 90-Day Voluntary Amnesty (Months 1-3)

All tour operators, travel agencies, and accommodation providers are offered:

1. **Free platform onboarding** with dedicated support
2. **Waived late-filing penalties** for historical non-compliance
3. **BSP integration assistance** (ZimVisit team handles technical setup)
4. **Training workshops** in Harare, Bulawayo, Victoria Falls, Mutare

**Target:** Onboard 50+ operators representing 60% of formal tourism bookings

### Phase 2: Mandatory Compliance (Month 4)

- **SI (Statutory Instrument)** mandating ZimVisit as the **sole authorized booking platform** for all tourism services in Zimbabwe
- All operators must route bookings through ZimVisit compliance engine
- BSP/levy automation becomes the **only legal payment channel**
- IATA BSP license verification tied to ZimVisit registration

### Phase 3: Enforcement & AI Monitoring (Month 5+)

- ZTA inspectors use the Operator Compliance Grid for field audits
- AI agent fingerprinting detects shell agencies and token registrations
- Non-compliant operators face:
  - License suspension
  - Fines: 200% of unpaid levy/tax
  - Blacklisting from ZTA marketing programs
- Compliant operators receive:
  - "ZTA Verified" badge (marketing advantage)
  - Priority listing in ZTA promotions
  - Reduced audit frequency

---

## Revenue Projections

### 3-Year Pro Forma

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Registered operators | 150 | 300 | 480+ |
| Monthly transactions | 15,000 | 45,000 | 100,000+ |
| Platform revenue | US$48M | US$156M | US$360M |
| Levy collected (2%) | US$960K | US$3.1M | US$7.2M |
| VAT collected (15%) | US$7.2M | US$23.4M | US$54M |
| BSP fees (3%) | US$1.44M | US$4.68M | US$10.8M |
| Revenue capture rate | 68% | 85% | 95% |
| Estimated leakage | US$48M | US$24M | US$8M |

### ROI for Government

| Investment | Amount |
|------------|--------|
| Platform development | US$2.5M |
| Annual operations | US$1.2M |
| Marketing & onboarding | US$800K |
| **Total Year 1** | **US$4.5M** |
| **First-year revenue recovery** | **US$48M+** |
| **ROI** | **1,067%** |

---

## Implementation Timeline

```
MONTH 1-2     MONTH 3-4     MONTH 5-6     MONTH 7-8     MONTH 9-12
─────────     ─────────     ─────────     ─────────     ──────────
Pilot (5      Soft Launch   Full Launch   Enforcement   Scaling &
operators)    (50 ops)      (150 ops)     Begin         Optimization
                                                         
Pillar A+B    Pillar C      AI Engine     Mandate       Regional
testing       deployment    Live          SI Signed     Expansion
```

### Pilot Operators (TBCZ Members)

Selected 5 key operators for initial pilot:
1. Victoria Falls Travel (Victoria Falls)
2. Zimbabwe Safari Co. (Hwange)
3. Great Zimbabwe Tours (Masvingo)
4. Eastern Highlands Trek (Mutare)
5. Kariba Lakeside Lodge (Kariba)

---

## Technical Differentiators

### 1. AI "Proof-of-Process" Fingerprinting

Unlike passive compliance dashboards, ZimVisit's AI actively:
- Builds behavioral profiles for each agent (not just each operator)
- Detects "token registrations" where legitimate credentials mask unauthorized users
- Flags velocity anomalies: legitimate agents book 2-8 bookings/hour; flagged agents show 30-90+/hour
- Analyzes destination patterns: sudden shifts to unregistered or sanctioned destinations
- Monitors booking hours: legitimate agents work 7am-7pm; suspicious agents book 12am-4am

### 2. BSP Compliance Engine

- Routes all bookings through approved GDS rails (Amadeus/Travelport)
- Automatically calculates and withholds: Tourism Levy (2%), VAT (15%), BSP fee (3%)
- Generates real-time remittance reports for ZTA and ZIMRA
- QR-coded audit trail for every transaction (immutable)

### 3. Real-Time Revenue Dashboard

- Sub-second latency on transaction data
- Side-by-side comparison with IATA BSP official data
- Automated leakage estimation based on statistical modeling
- Operator-level drill-down with compliance scoring

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Operator resistance | High | High | Amnesty program, operator benefits (free POS, marketing boost) |
| Technical failures | Low | High | Redundant infrastructure, offline fallback, 24/7 support |
| Regulatory delays | Medium | Medium | Pre-clear SI through Attorney General's office |
| Payment provider issues | Low | Medium | Multi-provider (EcoCash + Paynow + Stripe), automatic failover |
| Data privacy concerns | Medium | Medium | GDPR-aligned data protection, encryption at rest/transit |

---

## Call to Action

ZimVisit is ready for pilot deployment within **30 days** of approval. We request:

1. **ZTA endorsement** for the platform as the official tourism booking system
2. **ZIMRA integration** to enable direct levy/tax remittance
3. **Drafting of Statutory Instrument** for mandatory compliance (effective Month 4)
4. **Pilot authorization** for 5 TBCZ member operators
5. **Seed funding** of US$4.5M for Year 1 operations

---

*"ZimVisit doesn't just track compliance — it makes compliance the path of least resistance. By embedding government requirements into a superior booking experience, we achieve what enforcement alone never could: voluntary, universal adoption."*

**Contact:** ZimVisit Project Team
**Email:** launch@zimvisit.co.zw
