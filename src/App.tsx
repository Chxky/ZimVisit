// Copyright (c) 2026 Pardon mahara and nextly@zohomail.com
// All rights reserved.

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Calculator, Landmark, ShieldAlert, RefreshCw, AlertTriangle, HelpCircle, Activity } from 'lucide-react';
import { Operator, ZimPass, BudgetAuction, LiveAuditLog } from './types';
import { INITIAL_OPERATORS, INITIAL_ZIMPASSES, SAMPLE_BUDGET_AUCTIONS, INITIAL_AUDIT_LOGS } from './data';
import PhoneSimulator from './components/PhoneSimulator';
import OperatorDashboard from './components/OperatorDashboard';
import GovernmentPortal from './components/GovernmentPortal';

export default function App() {
  // State for different participant views in the presentation
  const [activePresentationView, setActivePresentationView] = useState<'traveler' | 'operator' | 'government'>('government');
  
  // Dynamic unified states to coordinate multi-sided interactions
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [zimPasses, setZimPasses] = useState<ZimPass[]>(INITIAL_ZIMPASSES);
  const [budgetAuctions, setBudgetAuctions] = useState<BudgetAuction[]>(SAMPLE_BUDGET_AUCTIONS);
  const [auditLogs, setAuditLogs] = useState<LiveAuditLog[]>(INITIAL_AUDIT_LOGS);
  
  // Selected operator in the business dashboard
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('vf-heli');

  // Toggle state for presentation context sidebar
  const [showProblemContext, setShowProblemContext] = useState<boolean>(true);

  // COORDINATED STATE ACTION 1: Run manual transaction on POS Calculator
  const handleRunTransaction = (operatorId: string, amount: number) => {
    const timestamp = new Date().toLocaleTimeString();
    const levy = Math.round((amount * 0.02) * 100) / 100;
    const vat = Math.round((amount * 0.15) * 100) / 100;

    // Update operator revenue and append POS receipt
    setOperators(prev => prev.map(op => {
      if (op.id === operatorId) {
        // Boost compliance score slightly due to compliant POS route
        const increasedScore = Math.min(100, op.complianceScore + 3);
        const increasedTrust = Math.min(100, op.trustRating + 2);
        
        return {
          ...op,
          complianceScore: increasedScore,
          trustRating: increasedTrust,
          monthlyRevenue: op.monthlyRevenue + amount,
          recentPosReceipts: [
            {
              id: `TX-${Math.floor(Math.random() * 1000 + 9000)}`,
              timestamp: 'Just now',
              amount,
              levy,
              vat,
              remitted: true
            },
            ...op.recentPosReceipts
          ]
        };
      }
      return op;
    }));

    // Generate ZTA ledger split live log
    const targetOp = operators.find(o => o.id === operatorId);
    const newLog: LiveAuditLog = {
      id: `LOG-${Math.floor(Math.random() * 1000 + 5000)}`,
      timestamp,
      operatorName: targetOp ? targetOp.name : 'Licensed Operator',
      type: 'LEVY_SPLIT',
      message: `POS Transaction processed. Split remittance execution: $${levy.toFixed(2)} Levy routed to ZTA vault. $${vat.toFixed(2)} VAT routed to ZIMRA node.`,
      amount: levy,
      status: 'GREEN'
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // COORDINATED STATE ACTION 2: Scanned ZimPass QR Code at gate check-in
  const handleVerifyZimPassItem = (travelerName: string, itemId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Find the passport item to calculate pricing and fetch operator ID
    let itemPrice = 100;
    let opId = 'vf-heli';
    let itemName = 'Tourism Facility';

    const updatedPasses = zimPasses.map(pass => {
      if (pass.travelerName === travelerName) {
        const updatedItems = pass.items.map(item => {
          if (item.id === itemId) {
            itemPrice = item.price;
            opId = item.operatorId;
            itemName = item.name;
            return { ...item, status: 'Completed' as const };
          }
          return item;
        });
        return { ...pass, items: updatedItems };
      }
      return pass;
    });

    setZimPasses(updatedPasses);

    // Update operator revenue and boost trust score significantly
    setOperators(prev => prev.map(op => {
      if (op.id === opId) {
        const increasedCompliance = Math.min(100, op.complianceScore + 8);
        const increasedTrust = Math.min(100, op.trustRating + 10);
        const simulatedLevy = Math.round((itemPrice * 0.02) * 100) / 100;
        const simulatedVat = Math.round((itemPrice * 0.15) * 100) / 100;

        return {
          ...op,
          complianceScore: increasedCompliance,
          trustRating: increasedTrust,
          monthlyRevenue: op.monthlyRevenue + itemPrice,
          recentPosReceipts: [
            {
              id: `TX-SCAN-${Math.floor(Math.random() * 1000 + 4000)}`,
              timestamp: 'Just now',
              amount: itemPrice,
              levy: simulatedLevy,
              vat: simulatedVat,
              remitted: true
            },
            ...op.recentPosReceipts
          ]
        };
      }
      return op;
    }));

    // Log check-in transaction in official system audit feed
    const targetOp = operators.find(o => o.id === opId);
    const newLog: LiveAuditLog = {
      id: `LOG-${Math.floor(Math.random() * 1000 + 5000)}`,
      timestamp,
      operatorName: targetOp ? targetOp.name : 'Licensed Operator',
      type: 'SCAN_VERIFY',
      message: `ZimPass scan validation. Passenger: ${travelerName} checked in for ${itemName}. Statutory tourism levy securely split and locked.`,
      amount: Math.round((itemPrice * 0.02) * 100) / 100,
      status: 'GREEN'
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // COORDINATED STATE ACTION 3: Accept bid on Traveler Budget auction
  const handleAddAuction = (updatedAuction: BudgetAuction) => {
    // Replace auction in lists
    setBudgetAuctions(prev => {
      const idx = prev.findIndex(a => a.destination === updatedAuction.destination && a.travelerName === updatedAuction.travelerName);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updatedAuction;
        return copy;
      }
      return [updatedAuction, ...prev];
    });

    // If auction now settled, log in audit logs
    if (!updatedAuction.isActive && updatedAuction.bids.some(b => b.timestamp === 'Just now' || b.amount > 0)) {
      const timestamp = new Date().toLocaleTimeString();
      const activeBid = updatedAuction.bids[0]; // First bid accepted
      const newLog: LiveAuditLog = {
        id: `LOG-${Math.floor(Math.random() * 1000 + 5000)}`,
        timestamp,
        operatorName: activeBid ? activeBid.operatorName : 'Tourism Operator',
        type: 'LEVY_SPLIT',
        message: `Budget Reverse Auction settled. Traveler Emma Watson accepted package. Compliant booking split scheduled. Target: $${updatedAuction.targetBudget} settled at $${activeBid ? activeBid.amount : 0}.`,
        status: 'GREEN'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // COORDINATED STATE ACTION 4: Government trigger simulated GDS offshore transaction leakage check
  const handleTriggerAuditSimulate = () => {
    const timestamp = new Date().toLocaleTimeString();
    const suspectOperators = operators.filter(o => o.complianceScore < 60);
    const targetOp = suspectOperators[Math.floor(Math.random() * suspectOperators.length)] || operators[0];
    const suspectedSlippage = Math.floor(Math.random() * 12000 + 5000);

    // Increment operator offshore unreported delta
    setOperators(prev => prev.map(op => {
      if (op.id === targetOp.id) {
        const compromisedTrust = Math.max(5, op.trustRating - 8);
        return {
          ...op,
          unreportedBspDelta: op.unreportedBspDelta + suspectedSlippage,
          trustRating: compromisedTrust
        };
      }
      return op;
    }));

    // Log the offshore GDS bypass in the central registry logs
    const newLog: LiveAuditLog = {
      id: `LOG-${Math.floor(Math.random() * 1000 + 5000)}`,
      timestamp,
      operatorName: targetOp.name,
      type: 'OFFSHORE_MATCH',
      message: `CRITICAL GAP DETECTED: Discovered discrepancy between on-board tourist rosters & international flight filings. Est. bypass: USD $${suspectedSlippage.toLocaleString()}`,
      amount: suspectedSlippage,
      status: 'RED'
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // API COMPLIANCE LOGIC: Server-side Gemini AI auditor call
  const handleRunAIAudit = async (operator: Operator): Promise<string> => {
    const response = await fetch('/api/compliance/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operatorName: operator.name,
        complianceScore: operator.complianceScore,
        trustRating: operator.trustRating,
        transactionVolume: operator.monthlyRevenue,
        reportedBspDeltaStatus: operator.unreportedBspDelta > 50000 ? '🚨 CRITICAL SHORTFALL: High foreign split-billing mismatch spotted' : '⚠️ MINORSHORTFALL',
        description: operator.description
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to audit operator compliance.');
    }

    const data = await response.json();
    return data.report;
  };

  return (
    <div id="presentation-frame" className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Top Presentation Bar */}
      <span id="presentation-banner" className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 rounded-2xl w-10 h-10 flex items-center justify-center font-black text-slate-950 text-lg shadow-sm">
            ZV
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-none text-slate-100 uppercase">ZimVisit</h1>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-1">Zimbabwe Tourism Booking & Government Compliance Platform</p>
          </div>
        </div>

        {/* Dynamic Navigation perspective tab selectors */}
        <div className="flex bg-slate-850 p-1 rounded-2xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto gap-0.5">
          <button
            onClick={() => setActivePresentationView('traveler')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap focus:outline-none ${
              activePresentationView === 'traveler'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            1. Traveler App
          </button>
          
          <button
            onClick={() => setActivePresentationView('operator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap focus:outline-none ${
              activePresentationView === 'operator'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            2. Operator Dashboard
          </button>
          
          <button
            onClick={() => setActivePresentationView('government')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap focus:outline-none ${
              activePresentationView === 'government'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            3. Government Oversight
          </button>
        </div>
      </span>

      {/* Main Structural Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Problem / Context Panel (Visible/Collapsible) */}
        {showProblemContext && (
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-xs space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-slate-800">
                <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                <span className="font-extrabold tracking-wider uppercase text-[10px]">National Leakage Context</span>
              </div>
              <button 
                onClick={() => setShowProblemContext(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer transition-all"
              >
                Hide
              </button>
            </div>

            <div className="space-y-3 font-medium text-slate-600 leading-relaxed text-[11px]">
              <div>
                <p className="font-bold text-slate-800 uppercase text-[9px] text-rose-700 tracking-wider">The Problem: Offshore Evasion</p>
                <p className="mt-1">
                  Over **72% of foreign agencies bypass the local financial system** using virtual IATA pipelines. Foreign currencies are settled in accounts abroad (South Africa, Europe), leaving Zimbabwe with zero corporate tax and unsubmitted <strong>2% tourism statutory levies</strong>.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800 uppercase text-[9px] text-amber-700 tracking-wider">The Solution: Source Split POS</p>
                <p className="mt-1">
                  ZimVisit redirects payments. High-value visitor bookings are routed via a unified <strong>ZimPass QR</strong> code with source splitting: funds are automatically partitioned at payment gateways (USD bank cards / EcoCash / Paynow) immediately upon checkout.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800 uppercase text-[9px] text-emerald-700 tracking-wider">Coordinated Simulation Proof</p>
                <p className="mt-1">
                  Watch compliance scores shift! Try simulating bank splits on the <strong>Operator calculator</strong> or checking in Sarah Jenkins on the <strong>Smart QR scanner</strong> to see immediate updates in the <strong>Government live ledger stream</strong>!
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex flex-col justify-center items-center gap-1.5 text-center">
              <Activity className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-bold text-[10px] text-slate-700 uppercase">Live Audit Status</p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">{auditLogs.length} ledger logs active</p>
              </div>
            </div>
          </div>
        )}

        {/* Right Side Adaptive Showcase Screen (Dynamic based on selected presentation perspective) */}
        <div className={`col-span-1 ${showProblemContext ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
          
          {!showProblemContext && (
            <button
              onClick={() => setShowProblemContext(true)}
              className="mb-4 bg-slate-900 text-white rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shrink-0"
            >
              Show Side Problem Context Drawer
            </button>
          )}

          {/* Perspective A: Traveler Mobile Frame */}
          {activePresentationView === 'traveler' && (
            <div className="flex justify-center py-4 bg-slate-100 rounded-3xl border border-slate-205/60 min-h-[740px]">
              <PhoneSimulator
                zimPasses={zimPasses}
                onZimPassUpdate={setZimPasses}
                operators={operators}
                budgetAuctions={budgetAuctions}
                onAddAuction={handleAddAuction}
              />
            </div>
          )}

          {/* Perspective B: Business Operators Command Panel */}
          {activePresentationView === 'operator' && (
            <OperatorDashboard
              operators={operators}
              selectedOperatorId={selectedOperatorId}
              onSelectOperator={setSelectedOperatorId}
              onRunTransaction={handleRunTransaction}
              zimPasses={zimPasses}
              onVerifyZimPassItem={handleVerifyZimPassItem}
            />
          )}

          {/* Perspective C: Government Live National Dashboard */}
          {activePresentationView === 'government' && (
            <GovernmentPortal
              operators={operators}
              auditLogs={auditLogs}
              onTriggerAuditSimulate={handleTriggerAuditSimulate}
              onRunAIAudit={handleRunAIAudit}
            />
          )}

        </div>

      </main>

      {/* Presentation Footer info bar */}
      <footer className="bg-white border-t border-slate-200/60 py-3 px-6 text-center text-xs text-slate-450 shrink-0">
        <p className="font-semibold tracking-wide text-[11px] text-slate-500 uppercase">
          🚨 ZimVisit Prototype Demonstration Platform • Built for Ministry of Tourism (ZTA) and National Treasury Regulatory Oversight
        </p>
      </footer>

    </div>
  );
}
