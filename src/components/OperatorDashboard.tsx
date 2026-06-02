/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Calculator, RefreshCw, Check, QrCode, AlertTriangle, Play, HelpCircle, FileText, Landmark, UserCheck } from 'lucide-react';
import { Operator, ZimPass } from '../types';

interface OperatorDashboardProps {
  operators: Operator[];
  selectedOperatorId: string;
  onSelectOperator: (id: string) => void;
  onRunTransaction: (operatorId: string, amount: number) => void;
  zimPasses: ZimPass[];
  onVerifyZimPassItem: (travelerName: string, itemId: string) => void;
}

export default function OperatorDashboard({
  operators,
  selectedOperatorId,
  onSelectOperator,
  onRunTransaction,
  zimPasses,
  onVerifyZimPassItem
}: OperatorDashboardProps) {
  const currentOperator = operators.find(o => o.id === selectedOperatorId) || operators[0];
  
  // State for POS pricing calculator
  const [ticketAmount, setTicketAmount] = useState<number>(350);
  const [splittingState, setSplittingState] = useState<'idle' | 'splitting' | 'done'>('idle');
  const [splitResult, setSplitResult] = useState<{
    levy: number;
    vat: number;
    net: number;
    zId: string;
    vId: string;
    oId: string;
  } | null>(null);

  // Filter ZimPasses that contain items belonging to this operator and are not 'Completed' yet
  const pendingsScans: { travelerName: string; itemId: string; itemName: string; status: string; price: number }[] = [];
  zimPasses.forEach(pass => {
    pass.items.forEach(item => {
      if (item.operatorId === currentOperator.id && item.status !== 'Completed') {
        pendingsScans.push({
          travelerName: pass.travelerName,
          itemId: item.id,
          itemName: item.name,
          status: item.status,
          price: item.price
        });
      }
    });
  });

  const [selectedScanIndex, setSelectedScanIndex] = useState<number>(0);
  const [scanningState, setScanningState] = useState<'idle' | 'analyzing' | 'success'>('idle');

  const calculateSplits = (amount: number) => {
    const levy = Math.round((amount * 0.02) * 100) / 100;
    const vat = Math.round((amount * 0.15) * 100) / 100;
    const net = Math.round((amount - levy - vat) * 100) / 100;
    return { levy, vat, net };
  };

  const handleSimulateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketAmount <= 0) return;

    setSplittingState('splitting');
    const { levy, vat, net } = calculateSplits(ticketAmount);

    setTimeout(() => {
      setSplitResult({
        levy,
        vat,
        net,
        zId: `TX-ZTA-${Math.floor(Math.random() * 10000000).toString(16).toUpperCase()}`,
        vId: `TX-ZIMRA-${Math.floor(Math.random() * 10000000).toString(16).toUpperCase()}`,
        oId: `CR-BANK-${Math.floor(Math.random() * 10000000).toString(16).toUpperCase()}`
      });
      setSplittingState('done');
      
      // Update operator state in parent (monthlyRevenue and add POS receipt)
      onRunTransaction(currentOperator.id, ticketAmount);
    }, 1200);
  };

  const handleVerifyItem = (scan: typeof pendingsScans[0]) => {
    setScanningState('analyzing');
    setTimeout(() => {
      onVerifyZimPassItem(scan.travelerName, scan.itemId);
      setScanningState('success');
      setTimeout(() => {
        setScanningState('idle');
        setSelectedScanIndex(0);
      }, 2000);
    }, 1500);
  };

  const { levy, vat, net } = calculateSplits(ticketAmount);

  return (
    <div className="space-y-6">
      
      {/* Banner / Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-105">
            Side B: Operator CommandCenter
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-1.5 tracking-tight">Interactive Local Operator Interface</h2>
          <p className="text-xs text-slate-400">Select any Zimbabwe licensed tour/accommodation partner to see their local dashboard view.</p>
        </div>

        {/* Dropdown to switch operator */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operator Profile:</label>
          <select
            className="bg-slate-100 font-semibold text-xs border border-slate-200 px-3 py-2 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
            value={selectedOperatorId}
            onChange={(e) => {
              onSelectOperator(e.target.value);
              setSplitResult(null);
              setSplittingState('idle');
            }}
          >
            {operators.map(op => (
              <option key={op.id} value={op.id}>{op.name} ({op.region})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Operator Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPLIANCE OVERVIEW PANELS (8-columns on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Compliance Status & Fingerprint Health Circle */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-slate-500" />
              Direct Compliance Audit Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 items-center">
              {/* Compliance Score Dial */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 pr-0 md:pr-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Outer SVG Ring */}
                  <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke={currentOperator.complianceScore < 60 ? '#ef4444' : currentOperator.complianceScore < 85 ? '#f59e0b' : '#10b981'} 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * currentOperator.complianceScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Inside dial text */}
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{currentOperator.complianceScore}%</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">BSP Compliance</p>
                  </div>
                </div>

                {/* Rating category text overlay */}
                <div className="mt-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
                    currentOperator.complianceScore < 60 
                      ? 'bg-red-50 text-red-700 border border-red-100' 
                      : currentOperator.complianceScore < 85 
                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {currentOperator.complianceScore < 60 ? 'CRITICAL RISKS FLAGGED' : currentOperator.complianceScore < 85 ? 'AMBER COMPLIANT' : 'ZTA TRUST GREEN'}
                  </span>
                </div>
              </div>

              {/* Behavior Analysis indicators */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 font-bold">Proof-of-Process Fingerprint Rating</span>
                    <span className="font-mono font-bold text-slate-800">{currentOperator.trustRating}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        currentOperator.trustRating < 50 ? 'bg-red-500' : currentOperator.trustRating < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${currentOperator.trustRating}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/50">
                  <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">AI Audit Evaluation</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium mt-1">
                    {currentOperator.complianceScore < 50 
                      ? "High risk of virtual agency proxy ticket loops. Discrepancy uncovered between IATA BSP billing files and real ticket outputs."
                      : currentOperator.complianceScore < 85
                      ? "Occasional sync-delays noticed in regional terminals. No deliberate fraud traces detected. Minor manual gaps."
                      : "Zero anomalies. POS transaction hashes and tax split records perfectly sync with central ZTA Ledger."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive POS Split Calculator */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800 relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">
              <Landmark className="w-3 h-3 text-amber-400" />
              POS SECURE PORTAL
            </div>

            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-5 h-5" />
               statutory 2% Tourism Levy & VAT Splitter
            </h3>
            <p className="text-xs text-slate-300 mt-1">Simulate POS instant receipt creation. ZimVisit will split taxes at source and route revenues instantly to respective accounts.</p>

            <form onSubmit={handleSimulateSplit} className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-8">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enter Booking Ticket Value ($ USD):</label>
                <div className="relative mt-1.5 rounded-xl shadow-xs overflow-hidden">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-slate-100">$</div>
                  <input
                    type="number"
                    min="10"
                    max="50000"
                    value={ticketAmount}
                    onChange={(e) => {
                      setTicketAmount(Number(e.target.value));
                      if (splittingState === 'done') setSplittingState('idle');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-8 pr-12 focus:outline-none focus:border-amber-500 font-bold"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-mono">USD</div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={splittingState === 'splitting'}
                className="md:col-span-4 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-sm transition-all focus:outline-none flex items-center justify-center gap-1 shrink-0"
              >
                {splittingState === 'splitting' ? (
                  <>Splitting...</>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Split Ticket
                  </>
                )}
              </button>
            </form>

            {/* Calculations Breakdown Screen */}
            <div className="grid grid-cols-3 gap-3.5 mt-5 text-center text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Statutory tourism Levy (2%)</p>
                <p className="text-sm font-extrabold text-amber-300 font-mono mt-1">${levy.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ZIMRA VAT Portion (15%)</p>
                <p className="text-sm font-extrabold text-teal-300 font-mono mt-1">${vat.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">NET Operator Credit (83%)</p>
                <p className="text-sm font-extrabold text-emerald-400 font-mono mt-1">${net.toFixed(2)}</p>
              </div>
            </div>

            {/* Simulated instant bank network splittings */}
            {splittingState === 'splitting' && (
              <div className="mt-5 p-4 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-xs gap-2 py-6 animate-pulse">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                <span className="font-mono text-slate-300">Contacting Reserve Bank RBZ-Gate Node & splitting funds...</span>
              </div>
            )}

            {splittingState === 'done' && splitResult && (
              <div className="mt-5 p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 text-[11px] space-y-2 font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <Check className="w-4 h-4 bg-emerald-500 text-slate-950 rounded-full p-0.5" />
                  <span>TRANSACTION SPLIT SUCCESSFUL (LEDGER LOGGED)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] pt-1">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block uppercase font-bold">ZTA Levy Vault Split</span>
                    <span className="text-amber-400 block font-bold font-mono mt-0.5">+${splitResult.levy.toFixed(2)}</span>
                    <span className="text-slate-500 text-[8px] block truncate mt-1">Hash: {splitResult.zId}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block uppercase font-bold">ZIMRA VAT Split</span>
                    <span className="text-teal-400 block font-bold font-mono mt-0.5">+${splitResult.vat.toFixed(2)}</span>
                    <span className="text-slate-500 text-[8px] block truncate mt-1">Hash: {splitResult.vId}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block uppercase font-bold">Operator Pay Credit</span>
                    <span className="text-emerald-400 block font-bold font-mono mt-0.5">+${splitResult.net.toFixed(2)}</span>
                    <span className="text-slate-500 text-[8px] block truncate mt-1">Node ID: {splitResult.oId}</span>
                  </div>
                </div>
                
                <p className="text-[9px] text-slate-500 text-center italic pt-1 border-t border-slate-900">
                  Transaction mapped directly to EcoCash/Paynow clearance API and reported to national BSP metrics.
                </p>
              </div>
            )}
          </div>
          
        </div>

        {/* RIGHT INTERACTIVE PASS SCANNER & RECEIPT LOG (5-columns on large screens) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Passenger check-in scanner simulation cabinet */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-5 h-5 text-slate-500" />
                ZimPass Smart QR Ticket Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-1">Scan traveler smartphone QR code at arrival gates to log local arrival/entry compliance.</p>
            </div>

            {/* List of pending traveler tickets for this specific operator */}
            {pendingsScans.length === 0 ? (
              <div className="my-8 text-center py-6 bg-slate-50 border border-slate-200/50 rounded-2xl text-xs text-slate-400 space-y-2 flex flex-col items-center">
                <Check className="w-8 h-8 text-emerald-500 bg-emerald-50 rounded-full p-1.5" />
                <div>
                  <p className="font-bold">No Pending Passes Found</p>
                  <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto mt-0.5">All Sarah Jenkins's tickets for this operator have been checked in!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 my-4">
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-600 block text-[10px] uppercase tracking-wider">Select Traveler Pass to Scan:</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Awaiting Gate Scan</span>
                  </div>
                  
                  <div className="space-y-1">
                    {pendingsScans.map((scan, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedScanIndex(idx)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                          selectedScanIndex === idx 
                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <p className="text-xs">{scan.travelerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">{scan.itemName}</p>
                        </div>
                        <span className="font-mono text-[10px]">${scan.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated scanning action button */}
                <button
                  onClick={() => handleVerifyItem(pendingsScans[selectedScanIndex])}
                  disabled={scanningState === 'analyzing'}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm shrink-0"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  CONFIRM CHECK-IN & CAPTURE LEVY
                </button>
              </div>
            )}

            {/* Scanning diagnostics overlays */}
            {scanningState === 'analyzing' && (
              <div className="p-4 bg-blue-50 border border-blue-150 rounded-2xl flex flex-col items-center justify-center text-xs text-blue-900 gap-1.5 py-6 font-mono">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span>Reading ZimPass cryptograph...</span>
                <span className="text-[9px] text-slate-400 uppercase">Verifying BSP compliance status with ZTA node...</span>
              </div>
            )}

            {scanningState === 'success' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center text-xs text-emerald-900 gap-1.5 py-6">
                <Check className="w-8 h-8 text-white bg-emerald-500 rounded-full p-1.5 shadow" />
                <span className="font-bold">ZIMPASS SCAN VERIFIED SUCCESSFULLY</span>
                <span className="text-[10px] text-emerald-700 font-mono">Ledger log entry: LOG-{Math.floor(Math.random() * 1000 + 4000)} generated.</span>
              </div>
            )}
          </div>

          {/* Historical Recent Ledger split logs specifically for this operator */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              Recent POS Remittance Audit Logs
            </h3>
            <p className="text-xs text-slate-400 mt-1">Audited transactions processed through this operator's hardware terminal.</p>

            <div className="mt-4 space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {currentOperator.recentPosReceipts.map((rec) => (
                <div key={rec.id} className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-xs flex justify-between items-center font-mono">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{rec.id}</span>
                      <span className="text-[9px] text-slate-400">{rec.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ticket Amount: USD ${rec.amount.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] text-amber-600 font-bold block">Tax Split: ${(rec.levy + rec.vat).toFixed(2)}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      rec.remitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {rec.remitted ? 'REMITTED' : 'SPLITTING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
