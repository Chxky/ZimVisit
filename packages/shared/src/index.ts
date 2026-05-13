// ZimVisit Shared Types
// Used across backend, operator dashboard, and government portal

export enum UserRole {
  TRAVELER = 'traveler',
  OPERATOR = 'operator',
  OPERATOR_AGENT = 'operator_agent',
  OPERATOR_ADMIN = 'operator_admin',
  ZTA_OFFICIAL = 'zta_official',
  ZIMRA_OFFICIAL = 'zimra_official',
  SYSTEM_ADMIN = 'system_admin',
}

export enum BookingStatus {
  PENDING = 'pending',
  PENDING_PAYMENT = 'pending_payment',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentProvider {
  PAYNOW = 'paynow',
  ECOCASH = 'ecocash',
  STRIPE = 'stripe',
  CARD = 'card',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_REVIEW = 'pending_review',
  FLAGGED = 'flagged',
}

export enum OperatorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  operatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  operatorId?: string;
  status: BookingStatus;
  totalAmount: number;
  taxAmount: number;
  levyAmount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  isCompliant: boolean;
  qrCodeUrl?: string;
  items: BookingItem[];
  createdAt: string;
}

export interface BookingItem {
  id: string;
  itemType: string;
  itemName: string;
  price: number;
  quantity: number;
  startDate?: string;
  endDate?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionReference: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface ComplianceReport {
  id: string;
  bookingId: string;
  operatorId?: string;
  status: ComplianceStatus;
  isCompliant: boolean;
  levyAmount: number;
  vatAmount: number;
  bspFee: number;
  bspRouted: boolean;
  flags: string[];
  createdAt: string;
}

export interface Operator {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  status: OperatorStatus;
  complianceRate: number;
  riskScore: number;
  bspConnected: boolean;
  createdAt: string;
}

export interface Tour {
  id: string;
  operatorId: string;
  name: string;
  description: string;
  price: number;
  location: string;
  duration: string;
  maxCapacity: number;
  isActive: boolean;
  rating: number;
  categories: string[];
}

export interface RevenueStats {
  totalRevenue: number;
  totalTax: number;
  totalLevy: number;
  totalFees: number;
  totalBookings: number;
  complianceRate: number;
}

export interface AgentFingerprint {
  agentId: string;
  trustScore: number;
  anomalyScore: number;
  status: 'normal' | 'suspicious' | 'flagged';
  riskFactors: string[];
  confidence: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
