/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Operator, ZimPass, BudgetAuction, LiveAuditLog } from './types';

export const ZIMBABWE_REGIONS = [
  { name: 'Victoria Falls', lat: -17.9244, lng: 25.8572, description: 'Adventure hub & waterfall wonder' },
  { name: 'Hwange National Park', lat: -18.7303, lng: 26.9606, description: 'Premier big game safari' },
  { name: 'Lake Kariba', lat: -16.5186, lng: 28.7997, description: 'Houseboats & freshwater fishing' },
  { name: 'Harare (Central Hub)', lat: -17.8252, lng: 31.0530, description: 'Capital city booking agencies' },
  { name: 'Bulawayo & Matopos', lat: -20.1488, lng: 28.5833, description: 'Heritage sites & granite hills' },
  { name: 'Great Zimbabwe', lat: -20.2678, lng: 30.9314, description: 'Ancient stone city ruins' }
];

export const INITIAL_OPERATORS: Operator[] = [
  {
    id: 'vf-heli',
    name: 'Victoria Falls Helicopter Safaris',
    region: 'Victoria Falls',
    type: 'Activity',
    complianceScore: 45,
    trustRating: 32,
    monthlyRevenue: 185000,
    unreportedBspDelta: 102000,
    latitude: -17.9244,
    longitude: 25.8572,
    description: 'Provides tourist flights over the Victoria Falls. Relies heavily on agents based in South Africa. Highly suspected of split-billing ticketing and bypass of local 2% statutory levies.',
    recentPosReceipts: [
      { id: 'TX-9021', timestamp: '10 mins ago', amount: 350.00, levy: 7.00, vat: 52.50, remitted: false },
      { id: 'TX-9018', timestamp: '45 mins ago', amount: 350.00, levy: 7.00, vat: 52.50, remitted: true },
      { id: 'TX-8995', timestamp: '2 hours ago', amount: 700.00, levy: 14.00, vat: 105.00, remitted: false }
    ]
  },
  {
    id: 'mosi-lodge',
    name: 'Mosi-oa-Tunya Luxury River Lodge',
    region: 'Victoria Falls',
    type: 'Accommodation',
    complianceScore: 94,
    trustRating: 98,
    monthlyRevenue: 340000,
    unreportedBspDelta: 8000,
    latitude: -17.9123,
    longitude: 25.8456,
    description: 'High-end riverside accommodation. Fully integrated with local banking partners and automated ZimVisit instant tax split POS routing. Exceptional statutory compliance track record.',
    recentPosReceipts: [
      { id: 'TX-9025', timestamp: 'Just now', amount: 1250.00, levy: 25.00, vat: 187.50, remitted: true },
      { id: 'TX-9012', timestamp: '1 hour ago', amount: 980.00, levy: 19.60, vat: 147.00, remitted: true },
      { id: 'TX-8987', timestamp: '4 hours ago', amount: 2400.00, levy: 48.00, vat: 360.00, remitted: true }
    ]
  },
  {
    id: 'hwange-bush',
    name: 'Hwange National Park Bush Camp',
    region: 'Hwange National Park',
    type: 'Accommodation',
    complianceScore: 82,
    trustRating: 75,
    monthlyRevenue: 155000,
    unreportedBspDelta: 22000,
    latitude: -18.7303,
    longitude: 26.9606,
    description: 'Off-grid wilderness safari camp. Suffers from low-bandwidth problems which sometimes delays manual levy declaration. Transitioning to ZimVisit’s offline POS compliance ledger.',
    recentPosReceipts: [
      { id: 'TX-9015', timestamp: '30 mins ago', amount: 650.00, levy: 13.00, vat: 97.50, remitted: true },
      { id: 'TX-8999', timestamp: '3 hours ago', amount: 1300.00, levy: 26.00, vat: 195.00, remitted: false }
    ]
  },
  {
    id: 'kariba-houseboat',
    name: 'Kariba Horizon Houseboat Charters',
    region: 'Lake Kariba',
    type: 'Activity',
    complianceScore: 58,
    trustRating: 48,
    monthlyRevenue: 120000,
    unreportedBspDelta: 45000,
    latitude: -16.5186,
    longitude: 28.7997,
    description: 'Private charter vessels operating multi-day lake tours. Payment routing often uses foreign e-commerce accounts registered in the UK, dodging the ZTA Tourism Levy at source.',
    recentPosReceipts: [
      { id: 'TX-9004', timestamp: '2 hours ago', amount: 1500.00, levy: 30.00, vat: 225.00, remitted: false },
      { id: 'TX-8971', timestamp: '5 hours ago', amount: 3000.00, levy: 60.00, vat: 450.00, remitted: true }
    ]
  },
  {
    id: 'hrey-travel',
    name: 'Harare Premier Gateways & Agency',
    region: 'Harare (Central Hub)',
    type: 'Agent',
    complianceScore: 35,
    trustRating: 21,
    monthlyRevenue: 280000,
    unreportedBspDelta: 175000,
    latitude: -17.8252,
    longitude: 31.0530,
    description: 'Metropolitan corporate ticketing agent. Heavily routes high-value corporate travel bookings to direct virtual GDS interfaces hosted offshore, withholding national tourism taxes.',
    recentPosReceipts: [
      { id: 'TX-9010', timestamp: '1 hour ago', amount: 800.00, levy: 16.00, vat: 120.00, remitted: false },
      { id: 'TX-8960', timestamp: '6 hours ago', amount: 1500.00, levy: 30.00, vat: 225.00, remitted: false }
    ]
  },
  {
    id: 'matopos-safari',
    name: 'Matopos Rhino & Heritage Agency',
    region: 'Bulawayo & Matopos',
    type: 'Activity',
    complianceScore: 91,
    trustRating: 90,
    monthlyRevenue: 75000,
    unreportedBspDelta: 4000,
    latitude: -20.1488,
    longitude: 28.5833,
    description: 'Cultural guiding agency and Rhino trail facilitator. Runs direct, local billing terminals configured auto-split. Reliable compliance with full-view accountability logs.',
    recentPosReceipts: [
      { id: 'TX-9022', timestamp: '5 mins ago', amount: 120.00, levy: 2.40, vat: 18.00, remitted: true },
      { id: 'TX-8991', timestamp: '3 hours ago', amount: 240.00, levy: 4.80, vat: 36.00, remitted: true }
    ]
  }
];

export const INITIAL_ZIMPASSES: ZimPass[] = [
  {
    id: 'ZPASS-90812',
    travelerName: 'Sarah Jenkins',
    passportNum: 'US482019A',
    nationality: 'United States',
    durationDays: 14,
    items: [
      { id: 'ZP-01', name: 'Mosi-oa-Tunya Lodge Residency', operatorId: 'mosi-lodge', status: 'Verified', price: 980 },
      { id: 'ZP-02', name: 'Victoria Falls Heliflight Walk', operatorId: 'vf-heli', status: 'Pending', price: 350 },
      { id: 'ZP-03', name: 'Hwange National Safari Booking', operatorId: 'hwange-bush', status: 'Pending', price: 650 }
    ]
  },
  {
    id: 'ZPASS-48192',
    travelerName: 'Kenji Sato',
    passportNum: 'JP092182B',
    nationality: 'Japan',
    durationDays: 7,
    items: [
      { id: 'ZP-04', name: 'Matopos Hills Rhino Trekking', operatorId: 'matopos-safari', status: 'Verified', price: 120 },
      { id: 'ZP-05', name: 'Kariba Houseboat Cruise', operatorId: 'kariba-houseboat', status: 'Completed', price: 1500 }
    ]
  }
];

export const SAMPLE_BUDGET_AUCTIONS: BudgetAuction[] = [
  {
    destination: 'Victoria Falls & Safari Combo',
    days: 4,
    targetBudget: 600,
    travelerName: 'Emma Watson',
    isActive: true,
    bids: [
      { operatorId: 'mosi-lodge', operatorName: 'Mosi-oa-Tunya Luxury River Lodge', amount: 580, offerDetails: '3 Nights Suite + Guided Falls Walk & Airport Transfer', trustRating: 98, timestamp: '2 mins ago' },
      { operatorId: 'hwange-bush', operatorName: 'Hwange National Park Bush Camp', amount: 550, offerDetails: '2 Nights Luxe Tent + Elephant Waterhole Game Tour', trustRating: 75, timestamp: '5 mins ago' }
    ]
  },
  {
    destination: 'Lake Kariba Fishing adventure',
    days: 3,
    targetBudget: 800,
    travelerName: 'Liam Harrison',
    isActive: true,
    bids: [
      { operatorId: 'kariba-houseboat', operatorName: 'Kariba Horizon Houseboat Charters', amount: 780, offerDetails: 'Full Luxury Catamaran + In-board Host & Fishing Gear', trustRating: 48, timestamp: 'Just now' }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: LiveAuditLog[] = [
  {
    id: 'LOG-4809',
    timestamp: '12:08:15',
    operatorName: 'Mosi-oa-Tunya Luxury River Lodge',
    type: 'LEVY_SPLIT',
    message: 'POS Receipt TX-9025 processed. Auto-remitted $25.00 ZTA Levy (2%) & $187.50 VAT (15%) directly to RBZ vault.',
    amount: 25.00,
    status: 'GREEN'
  },
  {
    id: 'LOG-4805',
    timestamp: '12:05:42',
    operatorName: 'Victoria Falls Helicopter Safaris',
    type: 'OFFSHORE_MATCH',
    message: 'ALERT: Suspicious flight registration matched offshore sales consolidator in Sandton, RSA. Delta estimated at USD $102,000.',
    amount: 102000,
    status: 'RED'
  },
  {
    id: 'LOG-4801',
    timestamp: '11:58:30',
    operatorName: 'Harare Premier Gateways & Agency',
    type: 'BSP_RECON',
    message: 'BSP discrepancy flagged. Real-time operator fingerprint trust rating dropped from 35% to 21% due to foreign split-billing patterns.',
    status: 'RED'
  },
  {
    id: 'LOG-4799',
    timestamp: '11:45:10',
    operatorName: 'Matopos Rhino & Heritage Agency',
    type: 'SCAN_VERIFY',
    message: 'ZimPass ZPASS-48192 item ZP-05 scanned successfully by operator Matopos Rhino & Heritage. Local levy compliance locked.',
    status: 'GREEN'
  },
  {
    id: 'LOG-4795',
    timestamp: '11:32:00',
    operatorName: 'Hwange National Park Bush Camp',
    type: 'LEVY_SPLIT',
    message: 'Delayed sync: POS Receipt TX-9015. Synced local offline compliance database. Levy $13.00 captured successfully.',
    amount: 13.00,
    status: 'AMBER'
  }
];
