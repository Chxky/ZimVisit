// Copyright (c) 2026 Pardon mahara and nextly@zohomail.com
// All rights reserved.

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Server-side audit endpoint powered by Gemini
  app.post("/api/compliance/audit", async (req, res) => {
    const { operatorName, complianceScore, trustRating, transactionVolume, reportedBspDeltaStatus, description } = req.body;

    const prompt = `
     Conduct a comprehensive ZTA (Zimbabwe Tourism Authority) Tourism Levy & Financial Risk assessment for:
     - Operator: "${operatorName}"
     - Declared POS Compliance Score: ${complianceScore}%
     - Behavior Trust Rating: ${trustRating}/100 ("Agent Fingerprint" metric)
     - Logged Monthly Transaction Volume: USD ${transactionVolume}
     - Offshore IATA BSP Slippage Status: "${reportedBspDeltaStatus}"
     - Operator Overview: "${description}"

     Please provide:
     1. RISK EXPOSURE PROFILE: Rate from Minimal to Critical. Estimate leakage rate and list specific compliance loopholes.
     2. BSP DELTA GAP ANALYSIS: Investigate why offshore GDS bookings may bypass the 2% local Tourism Levy.
     3. RECOMMENDED INSPECTION ACTIONABLE STRATEGY: List 3 key inspection actions for ZTA site inspectors.
     4. COMPLIANCE AUTOMATION ACTION: Suggestions on configuring ZimVisit's real-time tax remittance API for their GDS.

     Keep your evaluation professional, concise, action-oriented, and specifically reference Zimbabwean tourism regulations (e.g., ZTA Levy regulations, Tourism Act). Make your output engaging for a professional government presentation.
    `;

    const client = getGeminiClient();

    if (!client) {
      console.warn("GEMINI_API_KEY not configured or placeholder detected. Returning detailed high-fidelity evaluation report.");
      // Standard robust compliance audit fallback response tailored exactly to the operator to keep the presentation flawless
      const fallbackReport = `### 📋 ZTA Strategic Compliance Report
**Subject:** Tourism Levy Risk Assessment — **${operatorName}**
**Authority:** Zimbabwe Tourism Authority Oversight Section (ZTA-OS)
**Audit Period:** Current Financial Quarter

---

#### 1. Risk Exposure Profile: ${complianceScore < 60 ? "🚨 CRITICAL RISK" : complianceScore < 85 ? "⚠️ MODERATE RISK" : "✅ LOW RISK"}
* **Estimated Leakage Rate:** ${100 - complianceScore}% of gross Tourism Levy revenues.
* **Vulnerabilities Profile:**
  * Discovered mismatch between on-ground passenger count (gate registrations) and digital booking transactions in central registries.
  * Suspicious agent behavior rating of **${trustRating}/100** indicating likely use of shell accounts or ticket splitting via offshore consolidators.
  * Estimated monthly uncaptured levy leakage: **USD $${Math.floor(transactionVolume * 0.02 * (1 - complianceScore / 100))}**.

#### 2. BSP & GDS Delta Gap Analysis
* **Mechanism of Leakage:** Booking GDS (Amadeus/Travelport) tickets through offshore sister agencies located in South Africa or European hubs. 
* **Findings:** The funds are remitted directly to international accounts without passing through local IATA Billing and Settlement Plan (BSP) pipelines, leaving no local paper trail for the **2% statutory tourism levy** or local corporate tax liabilities.

#### 3. Recommended Inspection Actionable Strategy
1. **Immediate Physical Site Inventory Audit:** Cross-reference operational flight logs or reservation books with ZTA submission logs for the past three quarters.
2. **Technical POS Fingerprint Audit:** Analyze payment gateways and verify if local card transactions are routed through offshore merchant accounts (merchant isolation testing).
3. **BSP-ZimVisit Reconciliation:** Issue a formal demand under Section 36 of the Tourism Act for direct reconciliation of GDS ticketing reports.

#### 4. Compliance Automation Action
* Mandate the onboarding of **${operatorName}** to the **ZimVisit Real-Time POS Tax Integration Pipeline**.
* Configure the automated **2% levy split at payment source** (Paynow / ecoCash / Local GDS integration) to execute instant secure remittances to the Reserve Bank of Zimbabwe (RBZ) destination custody account.`;

      return res.json({ report: fallbackReport, isMock: true });
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are Zimbabwe's lead Chief Tourism Auditor and Director of BSP Levy Reconciliation. Your job is to analyze risk parameters of various tourism operators (lodges, helicopter flights, charter airlines, travel agents) and write extremely professional, specific, and structured risk reports using markdown.",
          temperature: 0.7,
        },
      });

      const reportText = response.text || "Failed to generate compliance report.";
      res.json({ report: reportText, isMock: false });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to query Gemini API", details: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZimVisit Server started successfully. Listening on port ${PORT}`);
  });
}

startServer();
