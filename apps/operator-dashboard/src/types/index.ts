export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  operatorId?: string;
  phone?: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  operatorId?: string;
  status: string;
  totalAmount: number;
  taxAmount: number;
  levyAmount: number;
  platformFee: number;
  netAmount: number;
  qrCodeUrl?: string;
  isCompliant: boolean;
  items: BookingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingItem {
  id: string;
  itemType: string;
  itemName: string;
  description?: string;
  startDate?: string;
  price: number;
  quantity: number;
}

export interface Tour {
  id: string;
  operatorId: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  categories?: string[];
  duration?: string;
  location?: string;
  maxCapacity?: number;
  bookedCount: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  inclusions?: string[];
  exclusions?: string[];
}

export interface Hotel {
  id: string;
  operatorId: string;
  name: string;
  description: string;
  address: string;
  city?: string;
  images?: string[];
  amenities?: string[];
  isActive: boolean;
  rating: number;
}

export interface ComplianceReport {
  id: string;
  bookingId: string;
  operatorId?: string;
  status: string;
  isCompliant: boolean;
  levyAmount: number;
  vatAmount: number;
  bspFee: number;
  bspRouted: boolean;
  bspReference?: string;
  flags?: string[];
  createdAt: string;
}

export interface AgentFingerprint {
  agentId: string;
  agentName: string;
  trustScore: number;
  anomalyScore: number;
  status: 'normal' | 'suspicious' | 'flagged';
  recentVelocity: number;
  unusualDestinations: string[];
  lastActivity: string;
  riskFactors: string[];
}
