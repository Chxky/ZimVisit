/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Operator {
  id: string;
  name: string;
  region: string;
  type: 'Accommodation' | 'Aviation' | 'Activity' | 'Agent';
  complianceScore: number; // 0 - 100
  trustRating: number; // 0 - 100
  monthlyRevenue: number;
  unreportedBspDelta: number; // Estimated offshore ticketing mismatch
  latitude: number;
  longitude: number;
  description: string;
  recentPosReceipts: {
    id: string;
    timestamp: string;
    amount: number;
    levy: number;
    vat: number;
    remitted: boolean;
  }[];
}

export interface ZimPass {
  id: string;
  travelerName: string;
  passportNum: string;
  nationality: string;
  durationDays: number;
  items: {
    id: string;
    name: string;
    operatorId: string;
    status: 'Pending' | 'Verified' | 'Completed';
    price: number;
  }[];
}

export interface Bid {
  operatorId: string;
  operatorName: string;
  amount: number;
  offerDetails: string;
  trustRating: number;
  timestamp: string;
}

export interface BudgetAuction {
  destination: string;
  days: number;
  targetBudget: number;
  travelerName: string;
  isActive: boolean;
  bids: Bid[];
}

export interface LiveAuditLog {
  id: string;
  timestamp: string;
  operatorName: string;
  type: 'LEVY_SPLIT' | 'OFFSHORE_MATCH' | 'BSP_RECON' | 'SCAN_VERIFY';
  message: string;
  amount?: number;
  status: 'GREEN' | 'AMBER' | 'RED';
}
