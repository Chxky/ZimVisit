/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle, CheckCircle2, MapPin, Sparkles, RefreshCw, FileText, Download, Play, HelpCircle, ArrowRight, Activity, Globe } from 'lucide-react';
import { Operator, LiveAuditLog } from '../types';

interface GovernmentPortalProps {
  operators: Operator[];
  auditLogs: LiveAuditLog[];
  onTriggerAuditSimulate: () => void;
  onRunAIAudit: (operator: Operator) => Promise<string>;
}

export default function GovernmentPortal({
  operators,
  auditLogs,
  onTriggerAuditSimulate,
  onRunAIAudit
}: GovernmentPortalProps) {
  // Region filtering state
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');
  
  // AI Audit Modal/Viewer state
  const [selectedAuditOperator, setSelectedAuditOperator] = useState<Operator | null>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingAiReport, setLoadingAiReport] = useState<boolean>(false);
  const [isReportMockCircle, setIsReportMockCircle] = useState<boolean>(false);

  // Compute stats dynamically derived from operators
  const totalCapturedPosLevy = operators.reduce((acc, op) => {
    // Levy is sum of all POS receipts that represent automated remittances (or simulated 2% score)
    const baseLevy = op.recentPosReceipts.reduce((sum, rec) => sum + (rec.remitted ? rec.levy : 0), 0);
    return acc + baseLevy + (op.monthlyRevenue * 0.02 * (op.complianceScore / 100));
  }, 0);

  const totalEstimatedLeakage = operators.reduce((acc, op) => {
    // Estimated offshore slippage
    return acc + op.unreportedBspDelta;
  }, 0);

  const activeOperatorsNum = operators.length;
  const averageCompliance = Math.round(operators.reduce((sum, op) => sum + op.complianceScore, 0) / operators.length);

  // Filter operators by region
  const filteredOperators = selectedRegionFilter === 'All'
    ? operators
    : operators.filter(o => o.region === selectedRegionFilter);

  const handleAuditingWithGemini = async (operator: Operator) => {
    setSelectedAuditOperator(operator);
    setAiReport('');
    setLoadingAiReport(true);
    
    try {
      const report = await onRunAIAudit(operator);
      setAiReport(report);
      // Quickly parse if mock fallback report was used
      if (report.includes('MOCK') || report.includes('Subject: Tourism Levy Risk Assessment')) {
        setIsReportMockCircle(true);
      } else {
        setIsReportMockCircle(false);
      }
    } catch (err) {
      setAiReport('Failed to execute ZTA AI audit engine right now. Please verify backend connection.');
    } finally {
      setLoadingAiReport(false);
    }
  };

  const handleExportCSV = () => {
    // Generate CSV mockup
    const headers = "ID,Operator,Region,BSA_Compliance,Trust_Factor,Monthly_Revenue,Offshore_Evasion_Delta\n";
    const rows = operators.map(op => 
      `"${op.id}","${op.name}","${op.region}",${op.complianceScore}%,${op.trustRating}%,$${op.monthlyRevenue},+$${op.unreportedBspDelta}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'zta_operator_compliance_report.csv');
    a.click();
    alert('📥 Successfully downloaded official ZTA national audit csv file.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-rose-100">
            Side C: ZTA & Government Executive Portal
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-1.5 tracking-tight">National Revenue Compliance Headquarters</h2>
          <p className="text-xs text-slate-400">Monitoring automated POS splits, regional tax leakages, and AI agent fingerprint anomaly detection.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerAuditSimulate}
            className="bg-slate-100 hover:bg-slate-205 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200/60 cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none shrink-0"
          >
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            Simulate BSP Transaction Stream
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs focus:outline-none shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Logs
          </button>
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* STAT 1: SECURED LEVY */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-6xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Captured POS Levy (USD)</p>
          <p className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight mt-1">
            ${totalCapturedPosLevy.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-2">
            <span className="bg-emerald-50 px-1 rounded border border-emerald-100">+10.4%</span>
            <span>captured compared to IATA BSP baseline</span>
          </div>
        </div>

        {/* STAT 2: SLIPPAGE LOSS */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4.5">
          <p className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">Estimated Offshore Delta Slip</p>
          <p className="text-2xl font-extrabold text-red-800 font-mono tracking-tight mt-1">
            ${totalEstimatedLeakage.toLocaleString('en-US')}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-red-700 font-bold mt-2">
            <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
            <span>Offshore proxy shell agencies actively bypassed</span>
          </div>
        </div>

        {/* STAT 3: CAPTURE SUCCESS RATE */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-6xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-slate-500">Capture Success Rate</p>
          <p className="text-2xl font-extrabold text-indigo-700 font-mono tracking-tight mt-1">
            {averageCompliance}%
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-2">
            <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
              <div className="h-full bg-indigo-600" style={{ width: `${averageCompliance}%` }}></div>
            </div>
            <span>National compliance coefficient</span>
          </div>
        </div>

        {/* STAT 4: TRACKED COOPERATIVES */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4.5">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tracked Tourism Partners</p>
          <p className="text-2xl font-extrabold text-amber-400 font-mono tracking-tight mt-1">
            {activeOperatorsNum} Active
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-300 font-medium mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Synchronized POS terminals</span>
          </div>
        </div>

      </div>

      {/* Map PoIs and Compliance Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG GEOGRAPHIC HEAT MAP Nodes (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-101 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-500" />
                Offshore Ticket Evasion Map PoIs
              </h3>
              {selectedRegionFilter !== 'All' && (
                <button 
                  onClick={() => setSelectedRegionFilter('All')}
                  className="text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded cursor-pointer transition-all"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Click any colored POI node to filter local operators and see regional compliance profiles.
            </p>
          </div>

          {/* Styled Geographic Map SVG Container */}
          <div className="my-6 border border-slate-100 bg-slate-50 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden self-center shadow-inner select-none w-full max-w-[360px] h-[280px]">
            {/* Outline Map of Zimbabwe modeled via beautiful path arcs */}
            <svg viewBox="0 0 100 100" className="w-[240px] h-[240px] opacity-20 text-slate-700">
              <path 
                d="M 30,15 A 15,15 0 0,1 55,20 A 10,10 0 0,0 72,12 A 12,12 0 0,1 82,35 A 10,10 0 0,0 95,50 A 8,8 0 0,1 88,72 A 20,20 0 0,1 65,88 A 25,25 0 0,1 32,82 A 15,15 0 0,1 15,62 A 22,22 0 0,1 10,38 A 12,12 0 0,1 30,15 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>

            {/* SVG Regions Markers (Clickable pulsing dots overlays mapped relative to Lat/Long) */}
            
            {/* POI: Victoria Falls (High offshore GDS proxy bypass risk!) */}
            <div 
              onClick={() => setSelectedRegionFilter('Victoria Falls')}
              className={`absolute top-[48%] left-[22%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all p-2 rounded-full hover:bg-red-100/30 ${
                selectedRegionFilter === 'Victoria Falls' ? 'bg-red-100/50 scale-110' : ''
              }`}
            >
              <div className="w-3.5 h-3.5 bg-red-650 rounded-full flex items-center justify-center relative shadow">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping"></span>
                <MapPin className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all shadow-md pointer-events-none whitespace-nowrap">
                Vic Falls (Critical Risk!)
              </div>
            </div>

            {/* POI: Hwange Safari (Moderate Risk node) */}
            <div 
              onClick={() => setSelectedRegionFilter('Hwange National Park')}
              className={`absolute top-[62%] left-[28%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all p-2 rounded-full hover:bg-amber-100/30 ${
                selectedRegionFilter === 'Hwange National Park' ? 'bg-amber-100/50 scale-110' : ''
              }`}
            >
              <div className="w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center relative shadow">
                <MapPin className="w-2 h-2 text-white" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all shadow-md pointer-events-none whitespace-nowrap">
                Hwange Safari (Amber)
              </div>
            </div>

            {/* POI: Kariba (Moderate Risk node) */}
            <div 
              onClick={() => setSelectedRegionFilter('Lake Kariba')}
              className={`absolute top-[32%] left-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all p-2 rounded-full hover:bg-amber-100/30 ${
                selectedRegionFilter === 'Lake Kariba' ? 'bg-amber-100/50 scale-110' : ''
              }`}
            >
              <div className="w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center relative shadow">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 animate-ping"></span>
                <MapPin className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all shadow-md pointer-events-none whitespace-nowrap">
                Kariba Charters (Amber)
              </div>
            </div>

            {/* POI: Harare (Capital bypass virtual hub!) */}
            <div 
              onClick={() => setSelectedRegionFilter('Harare (Central Hub)')}
              className={`absolute top-[38%] left-[75%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all p-2 rounded-full hover:bg-red-100/30 ${
                selectedRegionFilter === 'Harare (Central Hub)' ? 'bg-red-100/50 scale-110' : ''
              }`}
            >
              <div className="w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center relative shadow">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70 animate-ping"></span>
                <MapPin className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all shadow-md pointer-events-none whitespace-nowrap">
                Harare HQ Agency (High Risk!)
              </div>
            </div>

            {/* POI: Bulawayo (Safe compliant node) */}
            <div 
              onClick={() => setSelectedRegionFilter('Bulawayo & Matopos')}
              className={`absolute top-[72%] left-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all p-2 rounded-full hover:bg-emerald-100/30 ${
                selectedRegionFilter === 'Bulawayo & Matopos' ? 'bg-emerald-100/50 scale-110' : ''
              }`}
            >
              <div className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center relative shadow">
                <MapPin className="w-2 h-2 text-white" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all shadow-md pointer-events-none whitespace-nowrap">
                Bulawayo & Matopos (Safe)
              </div>
            </div>

            {/* Legenda overlay */}
            <div className="absolute bottom-2 left-2 bg-white/90 border border-slate-150 p-2 rounded-lg text-[9px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Critical Risk (&lt;50% Compliance)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Amber Risk (50-85% Compliance)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Fully Compliant (&gt;85% Score)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-[11px] text-slate-500 leading-normal">
            💡 <strong>Presentation Tip:</strong> Notice how <strong>Victoria Falls</strong> and <strong>Harare</strong> represent core friction zones. They capture massive foreign currency but use offshore consolidators. The map helps inspectors prioritize audits.
          </div>
        </div>

        {/* COMPLIANCE GRID MATRIX (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              ZTA Licensed Operators Registry Compliance Grid {selectedRegionFilter !== 'All' ? `(${selectedRegionFilter})` : ''}
            </h3>
            <p className="text-[11px] text-slate-400">Detailed overview of tracked transaction compliance across Zimbabwe's tourism portals.</p>
          </div>

          {/* Matrix Table */}
          <div className="my-4 overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-[10px] text-slate-400 font-extrabold uppercase bg-slate-50">
                  <th className="py-2.5 px-3">Operator Name</th>
                  <th className="py-2.5 px-2">Type</th>
                  <th className="py-2.5 px-2">Compliance</th>
                  <th className="py-2.5 px-2">Evasion Slip</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOperators.map((op) => (
                  <tr key={op.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-all">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-bold text-slate-800 text-[11px] leading-tight">{op.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{op.region}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {op.type}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold text-[11px] ${
                          op.complianceScore < 60 ? 'text-rose-600' : op.complianceScore < 85 ? 'text-amber-500' : 'text-emerald-600'
                        }`}>
                          {op.complianceScore}%
                        </span>
                        <div className="w-10 bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${op.complianceScore < 60 ? 'bg-rose-500' : op.complianceScore < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${op.complianceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[11px] text-rose-700 font-medium">
                      +${op.unreportedBspDelta.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleAuditingWithGemini(op)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1.5 rounded-lg text-[10px] inline-flex items-center gap-1 transition-all cursor-pointer focus:outline-none"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        AI Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] text-slate-400 italic text-right">
            Note: "Evasion Slip" represents estimated transaction volumes processed through overseas card processors bypassing statutory remit check-ins.
          </div>
        </div>

      </div>

      {/* DYNAMIC COMPLIANCE REPORT MODAL IF TRIGGERED (ZTA Auditor Console) */}
      {selectedAuditOperator && (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-extrabold text-white text-xs">
                AI
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Lead AI Statutory Tourism Auditor Terminal</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Target Audited Object: <strong>{selectedAuditOperator.name}</strong></p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setSelectedAuditOperator(null);
                setAiReport('');
              }}
              className="text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all"
            >
              Close Auditor Panel
            </button>
          </div>

          {loadingAiReport ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
              <div className="text-center space-y-1">
                <p className="text-xs font-mono tracking-widest text-indigo-300">ZTA COMPLIANCE BOT CONNECTING SECURE GATEWAY...</p>
                <p className="text-[10px] text-slate-400 max-w-[325px] leading-normal font-sans">Querying Gemini AI with Operator POS transaction metadata, behavior parameters, and BSP discrepancies...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Actual audit container */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 max-h-[350px] overflow-y-auto leading-relaxed text-xs">
                
                {/* Visual Header tags for Gemini report */}
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded-xl mb-4 text-[10px] text-indigo-300 font-mono">
                  <span>AUDIT HOST: GEMINI-3.5-FLASH</span>
                  <span className="bg-indigo-400/20 px-2 py-0.5 rounded text-[9px] font-bold">
                    {isReportMockCircle ? "COMPLIANCE KNOWLEDGE SEED" : "LIVE GEMINI RESPONSE"}
                  </span>
                </div>

                <div className="prose prose-invert prose-xs max-w-none text-slate-300 font-sans whitespace-pre-line space-y-3">
                  {aiReport}
                </div>
              </div>

              {/* Inspector action advice notice */}
              <div className="bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-900/40 flex items-start gap-2.5 text-[11px] leading-relaxed text-indigo-200">
                <Sparkles className="w-5 h-5 shrink-0 text-indigo-405 mt-0.5" />
                <div>
                  <strong>ZTA Action directive:</strong> The above AI evaluation report was compiled based on transaction matching parameters. If the compliance score is below 60%, ZTA Section 4 warrants physical accounting audits which can be scheduled automatically via the central pipeline.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scrolling Audit Logs stream */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-705 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <FileText className="w-4 h-4 text-slate-500" />
          ZTA National Reserve Ledger — Unified Live Audit Stream
        </h3>
        
        <div className="space-y-1.5 max-h-[190px] overflow-y-auto font-mono text-[11px] pr-1">
          {auditLogs.map((log) => (
            <div key={log.id} className="bg-slate-50 border-l-4 border-slate-205 p-2 rounded-r-xl flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">[{log.timestamp}]</span>
                  <span className={`font-bold uppercase text-[9px] px-1.5 py-0.2 rounded ${
                    log.status === 'GREEN' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : log.status === 'AMBER'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800 animate-pulse'
                  }`}>
                    {log.type}
                  </span>
                  <span className="font-bold text-slate-700">{log.operatorName}</span>
                </div>
                <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">{log.message}</p>
              </div>

              {log.amount && (
                <span className={`font-bold font-mono text-xs ${
                  log.status === 'GREEN' ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {log.status === 'GREEN' ? '+' : '-'}${log.amount.toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
