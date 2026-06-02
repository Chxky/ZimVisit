/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, Search, DollarSign, CheckCircle2, MapPin, Sparkles, Plus, Clock, Smile, Send } from 'lucide-react';
import { ZimPass, BudgetAuction, Operator, Bid } from '../types';

interface PhoneSimulatorProps {
  zimPasses: ZimPass[];
  onZimPassUpdate: (passes: ZimPass[]) => void;
  operators: Operator[];
  budgetAuctions: BudgetAuction[];
  onAddAuction: (newAuction: BudgetAuction) => void;
}

export default function PhoneSimulator({
  zimPasses,
  onZimPassUpdate,
  operators,
  budgetAuctions,
  onAddAuction
}: PhoneSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'pass' | 'auction'>('home');
  const [selectedPassIndex, setSelectedPassIndex] = useState<number>(0);
  
  // States for new auction budget form
  const [customDestination, setCustomDestination] = useState('');
  const [customDays, setCustomDays] = useState(3);
  const [customBudget, setCustomBudget] = useState(400);
  const [submittingAuction, setSubmittingAuction] = useState(false);

  // Auto-respond bidding simulation for new auctions
  useEffect(() => {
    const activeAuctions = budgetAuctions.filter(a => a.isActive && a.bids.length === 0);
    if (activeAuctions.length > 0) {
      const target = activeAuctions[0];
      const timer = setTimeout(() => {
        // Find suitable operators to bid
        const bidders = operators.filter(o => o.type !== 'Agent');
        const count = Math.min(2, bidders.length);
        const newBids: Bid[] = [];
        
        for (let i = 0; i < count; i++) {
          const op = bidders[i];
          const discountFactor = 0.85 + Math.random() * 0.12; // 85% to 97% of target budget
          const bidAmount = Math.floor(target.targetBudget * discountFactor);
          newBids.push({
            operatorId: op.id,
            operatorName: op.name,
            amount: bidAmount,
            offerDetails: `Exclusive ZimVisit presentation offer: All-inclusive safari package including accommodation & statutory tourism levy prepaid.`,
            trustRating: op.trustRating,
            timestamp: 'Just now'
          });
        }
        
        // Match bid
        target.bids = newBids;
        onAddAuction({ ...target });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [budgetAuctions, operators]);

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDestination) return;

    const newAuction: BudgetAuction = {
      destination: customDestination,
      days: customDays,
      targetBudget: customBudget,
      travelerName: 'Sarah Jenkins',
      isActive: true,
      bids: []
    };

    setSubmittingAuction(true);
    setTimeout(() => {
      onAddAuction(newAuction);
      setCustomDestination('');
      setCustomDays(3);
      setCustomBudget(400);
      setSubmittingAuction(false);
      setActiveTab('auction');
    }, 400);
  };

  const handleAcceptBid = (auction: BudgetAuction, bid: Bid) => {
    // Settle bid and create itinerary in Sarah's Pass
    const SarahPass = zimPasses.find(p => p.travelerName === 'Sarah Jenkins');
    if (SarahPass) {
      const updatedItems = [
        ...SarahPass.items,
        {
          id: `ZP-AUCT-${Math.floor(Math.random() * 10000)}`,
          name: `${auction.destination} (${bid.offerDetails.slice(0, 20)}...)`,
          operatorId: bid.operatorId,
          status: 'Pending' as const,
          price: bid.amount
        }
      ];
      
      const updatedPasses = zimPasses.map(p => {
        if (p.travelerName === 'Sarah Jenkins') {
          return { ...p, items: updatedItems };
        }
        return p;
      });

      onZimPassUpdate(updatedPasses);
      
      // Mark auction as settled/inactive
      auction.isActive = false;
      onAddAuction({ ...auction });
      
      alert(`🎉 Bid accepted! $${bid.amount} allocated securely. Item has been successfully formatted into your digital ZimPass with automated compliance routing enabled.`);
    }
  };

  const currentPass = zimPasses[selectedPassIndex] || zimPasses[0];

  return (
    <div id="phone-container" className="flex flex-col items-center">
      {/* Visual Header / Explainer tag */}
      <div className="mb-4 text-center">
        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
          Side A: Traveler Mobile App (Simulated)
        </span>
        <h3 className="text-sm text-slate-500 mt-1">Simulating offline passenger transactions, virtual wallet, & ZimPass</h3>
      </div>

      {/* Styled Physical Phone Frame */}
      <div className="w-[360px] h-[720px] bg-slate-900 rounded-[48px] shadow-2xl border-8 border-slate-800 p-3 relative flex flex-col overflow-hidden">
        {/* Phone Notch/Speaker */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-700 rounded-full z-50"></div>

        {/* Screen Background Area (Full app canvas) */}
        <div className="flex-1 rounded-[36px] bg-slate-50 flex flex-col overflow-hidden text-slate-800 pt-3 relative">
          
          {/* Mock Smartphone Status Bar */}
          <div className="h-6 px-5 flex justify-between items-center text-xs font-mono text-slate-600 bg-slate-100/50">
            <span>12:10 UTC</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-[1px] rounded scale-90">ONLINE</span>
              <div className="w-4 h-2.5 bg-slate-400 rounded-sm relative flex items-center p-[1px]">
                <div className="w-full h-full bg-slate-700 rounded-2xs"></div>
                <div className="w-[2px] h-1.5 bg-slate-400 absolute -right-[3px] rounded-r-xs"></div>
              </div>
            </div>
          </div>

          {/* Core Embedded Mobile App Header */}
          <header className="px-4 py-2 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900 text-xs">
                ZV
              </div>
              <div>
                <h1 className="text-xs font-bold leading-none tracking-tight">ZimVisit</h1>
                <p className="text-[9px] text-slate-400">Official Traveler Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400 font-mono tracking-wider">$ USD (Local Cash)</span>
            </div>
          </header>

          {/* Internal Content Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 pb-12 space-y-4 font-sans text-sm">
            
            {/* TAB CONTENT: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-4">
                {/* Hero Greeting Card */}
                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-3 -translate-y-2 opacity-10">
                    <QrCode className="w-32 h-32" />
                  </div>
                  <p className="text-xs text-amber-400 font-medium">Hello, Sarah Jenkins</p>
                  <h3 className="text-base font-bold mt-1 text-slate-50 tracking-tight">Explore Zimbabwe Compliantly</h3>
                  <p className="text-[11px] text-teal-100/80 mt-1.5 leading-relaxed">
                    Your bookings are monitored under RBZ Tourism guidelines. 2% statutory levy routing is fully integrated.
                  </p>
                  
                  {/* Active ZimPass Quick Widget */}
                  <div 
                    onClick={() => setActiveTab('pass')}
                    className="mt-3 bg-white/10 hover:bg-white/15 cursor-pointer border border-white/20 p-2.5 rounded-xl flex justify-between items-center transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-[11px] font-bold">Active Digital ZimPass</p>
                        <p className="text-[9px] text-teal-100">Tap to show pass QR</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                      {currentPass.items.filter(i => i.status === 'Completed').length}/{currentPass.items.length} Scans
                    </span>
                  </div>
                </div>

                {/* Name Your Budget (Reverse Auction Ad Card) */}
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold text-xs">Name Your Budget Auction</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Set your custom target dollar amount, and let verified local lodges & safaris compete dynamically for your booking!
                  </p>
                  <button 
                    onClick={() => setActiveTab('auction')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl text-center cursor-pointer transition-all shrink-0"
                  >
                    Host Budget Auction
                  </button>
                </div>

                {/* Quick Travel Search Card */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Hot Spots Booking</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex flex-col">
                      <span className="text-emerald-700 font-bold text-xs">Victoria Falls</span>
                      <span className="text-[10px] text-slate-400">River Lodges & flights</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex flex-col">
                      <span className="text-teal-700 font-bold text-xs">Hwange Safari</span>
                      <span className="text-[10px] text-slate-400 font-medium">Big five camps</span>
                    </div>
                  </div>
                </div>

                {/* Tourism Statutory Note banner */}
                <div className="bg-slate-100 p-2.5 rounded-xl text-[10px] text-slate-500 border border-slate-200/60 leading-relaxed">
                  ⚠️ <strong>BSP Safety Clause:</strong> In compliance with ZTA Regulation 10(B), ticketing from foreign IP addresses without local split verification is subject to temporary inspection holds. Make sure to buy through ZimVisit channels.
                </div>
              </div>
            )}

            {/* TAB CONTENT: ZIMPASS QR */}
            {activeTab === 'pass' && (
              <div className="space-y-4">
                {/* Selector */}
                <div className="flex gap-2 justify-center">
                  {zimPasses.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPassIndex(idx)}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                        selectedPassIndex === idx ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {p.travelerName.split(' ')[0]}'s Pass
                    </button>
                  ))}
                </div>

                {/* Core Pass Layout */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  {/* Digital Pass Header bar */}
                  <div className="bg-slate-900 text-white p-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold tracking-tight text-slate-100 text-xs">ZIMPASS SECURE</h4>
                      <p className="text-[9px] text-slate-400 font-mono">{currentPass.id}</p>
                    </div>
                    <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[9px]">
                      RBZ APPROVED
                    </span>
                  </div>

                  {/* QR Core Image simulation area */}
                  <div className="p-4 flex flex-col items-center bg-slate-50 border-b border-slate-100">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-inner mt-2 flex flex-col items-center select-none">
                      {/* Interactive Custom SVG styled QR Code with Zimbabwe Bird Silhouette logo in the center */}
                      <svg className="w-36 h-36 border-4 border-white" viewBox="0 0 100 100">
                        {/* QR Matrix Corner Anchors */}
                        <rect x="5" y="5" width="25" height="25" fill="#1e293b" />
                        <rect x="10" y="10" width="15" height="15" fill="#f8fafc" />
                        <rect x="12" y="12" width="11" height="11" fill="#1e293b" />

                        <rect x="70" y="5" width="25" height="25" fill="#1e293b" />
                        <rect x="75" y="10" width="15" height="15" fill="#f8fafc" />
                        <rect x="77" y="12" width="11" height="11" fill="#1e293b" />

                        <rect x="5" y="70" width="25" height="25" fill="#1e293b" />
                        <rect x="10" y="75" width="15" height="15" fill="#f8fafc" />
                        <rect x="12" y="77" width="11" height="11" fill="#1e293b" />

                        {/* Pixel matrix points map */}
                        <g fill="#1e293b">
                          <rect x="40" y="8" width="5" height="8" />
                          <rect x="48" y="15" width="8" height="5" />
                          <rect x="10" y="42" width="6" height="5" />
                          <rect x="22" y="50" width="10" height="5" />
                          <rect x="42" y="72" width="15" height="5" />
                          <rect x="55" y="85" width="10" height="8" />
                          <rect x="80" y="45" width="12" height="6" />
                          <rect x="68" y="55" width="5" height="12" />
                          <rect x="45" y="38" width="10" height="10" />
                          <rect x="72" y="75" width="15" height="5" />
                          <rect x="85" y="82" width="8" height="8" />
                          <rect x="35" y="85" width="6" height="10" />
                          <rect x="12" y="38" width="18" height="3" />
                        </g>

                        {/* Centered Zimbabwe Golden Bird Shield Symbol */}
                        <circle cx="50" cy="50" r="13" fill="#f59e0b" />
                        {/* Mimic Bird Silhouette inside golden circle */}
                        <path d="M 50 42 C 45 42, 45 58, 50 58 C 55 58, 55 42, 50 42 Z" fill="#1e293b" />
                        <path d="M 47 48 L 53 48 L 50 54 Z" fill="#f59e0b" />
                      </svg>
                      
                      <span className="text-[10px] font-mono font-bold text-slate-500 mt-2 tracking-widest text-center">
                        SCAN CODE AT OPERATORS
                      </span>
                    </div>

                    {/* Traveler Details */}
                    <div className="w-full grid grid-cols-2 gap-3 mt-4 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">PASSENGER NAME</p>
                        <p className="font-bold text-slate-700">{currentPass.travelerName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">PASSPORT / ID</p>
                        <p className="font-bold text-slate-700 font-mono">{currentPass.passportNum}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">NATIONALITY</p>
                        <p className="font-bold text-slate-700">{currentPass.nationality}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">VALID DURATION</p>
                        <p className="font-bold text-slate-700">{currentPass.durationDays} Days (ZTA Multi)</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Itinerary Items & Validation Checklist */}
                  <div className="p-3 space-y-2">
                    <h5 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Itinerary Checklist (Source Split Checked)</h5>
                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                      {currentPass.items.map((item) => (
                        <div key={item.id} className="bg-slate-50 border border-slate-200/60 p-2 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-700 truncate max-w-[170px]">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Cost: ${item.price} USD</span>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Completed' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : item.status === 'Verified'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: NAME YOUR BUDGET REVERSE AUCTION */}
            {activeTab === 'auction' && (
              <div className="space-y-4">
                
                {/* Subheading */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                  <Smile className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <strong>How it works:</strong> State your target budget and trip duration. ZimVisit distributes it to authorized operators. They submit custom package bids direct!
                  </div>
                </div>

                {/* Submitting form */}
                <form onSubmit={handleCreateAuction} className="bg-white border border-slate-205 rounded-2xl p-3.5 space-y-2 text-xs shadow-sm">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Where are you going in Zimbabwe?</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 mt-1 focus:outline-none focus:border-amber-500 font-medium"
                      placeholder="e.g. Victoria Falls Flight & Safari Cabin"
                      value={customDestination}
                      onChange={(e) => setCustomDestination(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Duration (Days)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 mt-1 focus:outline-none focus:border-amber-500 font-medium"
                        value={customDays}
                        onChange={(e) => setCustomDays(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Target Budget ($ USD)</label>
                      <input
                        type="number"
                        min="50"
                        max="10000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 mt-1 focus:outline-none focus:border-amber-500 font-semibold text-emerald-800"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingAuction}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2 shadow-sm"
                  >
                    {submittingAuction ? (
                      <>Processing Submission...</>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Host Budget Auction
                      </>
                    )}
                  </button>
                </form>

                {/* Existing budget auctions & actual agent bids */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Active Inquiries & Bids</h4>
                  {budgetAuctions.map((auction, idx) => (
                    <div key={idx} className="bg-slate-900 text-slate-100 rounded-2xl p-3 space-y-2 border border-slate-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-xs text-amber-400">{auction.destination}</h5>
                          <p className="text-[10px] text-slate-400">{auction.days} Days • Host: {auction.travelerName}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          auction.isActive ? 'bg-amber-400/20 text-amber-300 animate-pulse' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {auction.isActive ? 'AUCTION LIVE' : 'SETTLED'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] bg-slate-800/80 p-2 rounded-lg font-mono text-emerald-400">
                        <span>Target Budget:</span>
                        <span className="font-bold">${auction.targetBudget} USD</span>
                      </div>

                      {/* Bids List */}
                      <div className="space-y-2 pt-1 border-t border-slate-800">
                        <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">
                          Received Operator Offers ({auction.bids.length})
                        </span>
                        
                        {auction.bids.length === 0 ? (
                          <div className="text-center py-4 text-slate-500 text-xs flex flex-col items-center gap-1">
                            <Clock className="w-4 h-4 animate-spin text-amber-400" />
                            <span>Awaiting verified operators to submit bids...</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {auction.bids.map((bid, bIdx) => (
                              <div key={bIdx} className="bg-slate-800 rounded-xl p-2.5 border border-slate-700 flex flex-col gap-1 text-[11px] leading-tight">
                                <div className="flex justify-between items-center text-slate-200">
                                  <span className="font-bold truncate max-w-[150px]">{bid.operatorName}</span>
                                  <span className="text-amber-400 font-bold font-mono">${bid.amount}</span>
                                </div>
                                <p className="text-[10px] text-slate-300 leading-normal">{bid.offerDetails}</p>
                                <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                                  <span>Trust Fingerprint Rating: <strong className="text-emerald-400">{bid.trustRating}%</strong></span>
                                  {auction.isActive && (
                                    <button
                                      onClick={() => handleAcceptBid(auction, bid)}
                                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-2 py-0.5 rounded font-bold cursor-pointer transition-all"
                                    >
                                      Accept
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

          {/* Styled Mobile App Navigation Bottom Bar */}
          <nav className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex justify-around items-center shrink-0 z-40 px-2 shadow-lg">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 w-12 text-center select-none cursor-pointer ${
                activeTab === 'home' ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-[9px] font-bold">Explore</span>
            </button>
            <button 
              onClick={() => setActiveTab('pass')}
              className={`flex flex-col items-center gap-0.5 w-12 text-center select-none cursor-pointer ${
                activeTab === 'pass' ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-[9px] font-bold">ZimPass</span>
            </button>
            <button 
              onClick={() => setActiveTab('auction')}
              className={`flex flex-col items-center gap-0.5 w-12 text-center select-none cursor-pointer ${
                activeTab === 'auction' ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Search className="w-5 h-5 animate-pulse" />
              <span className="text-[9px] font-bold">Auction</span>
            </button>
          </nav>

        </div>
      </div>
    </div>
  );
}
