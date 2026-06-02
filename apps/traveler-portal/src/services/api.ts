// ============================================================
// ZimVisit Traveler Portal - API Service (Axios)
// ============================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  Booking,
  Hotel,
  LoginRequest,
  RegisterRequest,
  SearchFilters,
  Tour,
  User,
  ZimPassItinerary,
} from '../types';

// ---- Base Axios Instance ----

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor: Attach token from memory (cookies handle auth too) ----

let memoryToken: string | null = null;

export const setMemoryToken = (token: string | null) => {
  memoryToken = token;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (memoryToken && config.headers) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor: Handle errors globally ----

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      memoryToken = null;
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// Auth API
// ============================================================

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  demoLogin: async (role: string = 'traveler'): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/demo-login', { role });
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

// ============================================================
// Tour Normalizer - maps backend entity to frontend Tour type
// ============================================================

const DIFFICULTY_BY_CATEGORY: Record<string, string> = {
  safari: 'moderate',
  'victoria-falls': 'easy',
  hiking: 'challenging',
  cultural: 'easy',
  lake: 'easy',
  wildlife: 'moderate',
  adventure: 'challenging',
  historical: 'easy',
};

const PROVINCE_BY_LOCATION: Record<string, string> = {
  'Victoria Falls': 'Matabeleland North',
  'Hwange': 'Matabeleland North',
  'Mana Pools': 'Mashonaland West',
  'Matobo': 'Matabeleland South',
  'Masvingo': 'Masvingo',
  'Kariba': 'Mashonaland West',
  'Harare': 'Harare',
  'Bulawayo': 'Bulawayo',
  'Nyanga': 'Manicaland',
  'Chimanimani': 'Manicaland',
};

function normalizeTour(raw: any): Tour {
  const category = Array.isArray(raw.categories) ? raw.categories[0] : (raw.category || 'safari');
  const location = raw.location || 'Zimbabwe';

  return {
    id: raw._id || raw.id,
    name: raw.name || 'Untitled Tour',
    slug: raw.slug || raw.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
    description: raw.description || '',
    shortDescription: raw.shortDescription || (raw.description ? raw.description.slice(0, 120) + '...' : ''),
    location,
    province: raw.province || PROVINCE_BY_LOCATION[location] || 'Zimbabwe',
    category: category as any,
    images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [],
    price: Number(raw.price) || 0,
    currency: raw.currency || 'USD',
    duration: raw.duration || 'Full Day',
    durationHours: raw.durationHours,
    durationDays: raw.durationDays,
    maxGroupSize: raw.maxGroupSize || raw.maxCapacity || 12,
    difficulty: raw.difficulty || DIFFICULTY_BY_CATEGORY[category] || 'moderate',
    rating: Number(raw.rating) || 4.5,
    reviewCount: Number(raw.reviewCount) || 0,
    inclusions: Array.isArray(raw.inclusions) ? raw.inclusions : [],
    exclusions: Array.isArray(raw.exclusions) ? raw.exclusions : [],
    meetingPoint: raw.meetingPoint || location,
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [
      `Explore the beauty of ${location}`,
      'Professional guided experience',
      'Authentic Zimbabwean hospitality',
    ],
    operator: raw.operator || {
      id: raw.operatorId || 'op-1',
      name: 'Zimbabwe Tourism Operator',
      rating: 4.8,
    },
    isFeatured: raw.isFeatured ?? (Number(raw.rating) >= 4.8),
    isActive: raw.isActive ?? true,
    availability: Array.isArray(raw.availability) ? raw.availability : [],
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

// ============================================================
// Tours API
// ============================================================

export const toursApi = {
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: filters });
    const raw = response.data;
    const data = Array.isArray(raw) ? raw : raw?.data || [];
    return { ...raw, data: data.map(normalizeTour) };
  },

  getById: async (id: string): Promise<ApiResponse<Tour>> => {
    const response = await api.get(`/inventory/tours/${id}`);
    const raw = response.data;
    const tour = raw?.data || raw;
    return { ...raw, data: normalizeTour(tour) };
  },

  getFeatured: async (): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: { featured: true } });
    const raw = response.data;
    const data = Array.isArray(raw) ? raw : raw?.data || [];
    return { ...raw, data: data.map(normalizeTour) };
  },

  getByCategory: async (category: string): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: { category } });
    const raw = response.data;
    const data = Array.isArray(raw) ? raw : raw?.data || [];
    return { ...raw, data: data.map(normalizeTour) };
  },

  search: async (query: string): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: { search: query } });
    const raw = response.data;
    const data = Array.isArray(raw) ? raw : raw?.data || [];
    return { ...raw, data: data.map(normalizeTour) };
  },

  getSimilar: async (id: string): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get(`/inventory/tours/${id}/similar`);
    const raw = response.data;
    const data = Array.isArray(raw) ? raw : raw?.data || [];
    return { ...raw, data: data.map(normalizeTour) };
  },

  getReviews: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/inventory/tours/${id}/reviews`);
    return response.data;
  },
};

// ============================================================
// Hotels API
// ============================================================

export const hotelsApi = {
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<Hotel[]>> => {
    const response = await api.get('/inventory/hotels', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Hotel>> => {
    const response = await api.get(`/inventory/hotels/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<ApiResponse<Hotel[]>> => {
    const response = await api.get('/inventory/hotels/featured');
    return response.data;
  },

  search: async (query: string): Promise<ApiResponse<Hotel[]>> => {
    const response = await api.get('/inventory/hotels/search', { params: { q: query } });
    return response.data;
  },
};

// ============================================================
// Bookings API
// ============================================================

export const bookingsApi = {
  getAll: async (status?: string): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get('/bookings', { params: { status } });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (data: {
    items: Array<{
      type: string;
      itemId: string;
      date: string;
      quantity: number;
    }>;
    startDate: string;
    endDate: string;
    travelers: number;
    specialRequests?: string;
  }): Promise<ApiResponse<Booking>> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  cancel: async (id: string, reason?: string): Promise<ApiResponse<Booking>> => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  getZimPass: async (bookingId: string): Promise<ApiResponse<ZimPassItinerary>> => {
    const response = await api.get(`/bookings/${bookingId}/zimpass`);
    return response.data;
  },
};

// ============================================================
// Reports API
// ============================================================

export const reportApi = {
  /**
   * Get economic impact data for the current user.
   * Falls back gracefully if the endpoint is not available (government-only).
   */
  getEconomicImpact: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/reports/economic-impact');
    return response.data;
  },

  getPlatformStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/reports/platform-stats');
    return response.data;
  },
};

// ============================================================
// Users API
// ============================================================

export const userApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};

export default api;
