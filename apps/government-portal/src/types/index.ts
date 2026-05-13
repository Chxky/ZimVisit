export interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'compliant' | 'amber' | 'red';
  complianceRate: number;
  totalRevenue: number;
  totalLevy: number;
  totalBookings: number;
  lastAudit: string;
  riskScore: number;
  address?: string;
  licenseNumber?: string;
  registrationDate: string;
  agentCount: number;
  recentFlags: string[];
}

export interface RevenueData {
  date: string;
  totalRevenue: number;
  platformRevenue: number;
  bspRevenue: number;
  taxCollected: number;
  levyCollected: number;
  leakage: number;
}

export interface RiskPrediction {
  operatorId: string;
  operatorName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedLeakage: number;
  confidenceScore: number;
  topFactors: string[];
  recommendedAction: string;
}

export interface NationalStats {
  totalOperators: number;
  activeOperators: number;
  totalTransactions: number;
  totalRevenue: number;
  totalTaxCollected: number;
  totalLevyCollected: number;
  revenueCaptureRate: number;
  estimatedLeakage: number;
  compliantOperators: number;
  amberOperators: number;
  redOperators: number;
}
