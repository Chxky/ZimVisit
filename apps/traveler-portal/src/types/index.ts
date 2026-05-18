// ============================================================
// ZimVisit Traveler Portal - Type Definitions
// ============================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'traveler' | 'operator' | 'admin';
  isVerified: boolean;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  travelInterests: string[];
}

export interface Tour {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  location: string;
  province: string;
  category: TourCategory;
  images: string[];
  price: number;
  currency: string;
  duration: string;
  durationHours?: number;
  durationDays?: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  rating: number;
  reviewCount: number;
  inclusions: string[];
  exclusions: string[];
  meetingPoint: string;
  highlights: string[];
  operator: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  isFeatured: boolean;
  isActive: boolean;
  availability: TourAvailability[];
  createdAt: string;
  updatedAt: string;
}

export type TourCategory =
  | 'safari'
  | 'victoria-falls'
  | 'hiking'
  | 'cultural'
  | 'lake'
  | 'wildlife'
  | 'adventure'
  | 'historical'
  | 'wine'
  | 'photography';

export interface TourAvailability {
  date: string;
  spotsLeft: number;
  priceOverride?: number;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  province: string;
  category: string;
  starRating: number;
  images: string[];
  pricePerNight: number;
  currency: string;
  amenities: string[];
  roomTypes: RoomType[];
  rating: number;
  reviewCount: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxOccupancy: number;
  amenities: string[];
  images: string[];
}

export interface Booking {
  id: string;
  reference: string;
  userId: string;
  status: BookingStatus;
  items: BookingItem[];
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  specialRequests?: string;
  zimpassQR?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'partial'
  | 'paid'
  | 'refunded'
  | 'failed';

export interface BookingItem {
  id: string;
  type: 'tour' | 'hotel' | 'activity' | 'transfer';
  itemId: string;
  itemName: string;
  itemImage?: string;
  date: string;
  endDate?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface SearchFilters {
  query?: string;
  location?: string;
  province?: string;
  category?: TourCategory | string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  difficulty?: string;
  rating?: number;
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface ZimPassItinerary {
  id: string;
  bookingId: string;
  userId: string;
  qrCode: string;
  validFrom: string;
  validTo: string;
  items: ZimPassItem[];
  emergencyContact: string;
  status: 'active' | 'expired' | 'used';
  createdAt: string;
}

export interface ZimPassItem {
  id: string;
  type: 'flight' | 'hotel' | 'tour' | 'transfer' | 'activity';
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'skipped';
  confirmationCode?: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  text: string;
  tourName: string;
}

export interface Destination {
  id: string;
  name: string;
  province: string;
  description: string;
  image: string;
  icon: string;
  tourCount: number;
  highlight: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  accessToken?: string;
  refreshToken: string;
}
