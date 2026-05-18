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
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor: Attach token ----

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('zimvisit_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem('zimvisit_token');
      localStorage.removeItem('zimvisit_refresh_token');
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
// Tours API
// ============================================================

export const toursApi = {
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Tour>> => {
    const response = await api.get(`/inventory/tours/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: { featured: true } });
    return response.data;
  },

  getByCategory: async (category: string): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: { category } });
    return response.data;
  },

  search: async (query: string): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get('/inventory/tours', { params: { search: query } });
    return response.data;
  },

  getSimilar: async (id: string): Promise<ApiResponse<Tour[]>> => {
    const response = await api.get(`/inventory/tours/${id}/similar`);
    return response.data;
  },

  getReviews: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/tours/${id}/reviews`);
    return response.data;
  },
};

// ============================================================
// Hotels API
// ============================================================

export const hotelsApi = {
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<Hotel[]>> => {
    const response = await api.get('/hotels', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Hotel>> => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<ApiResponse<Hotel[]>> => {
    const response = await api.get('/hotels/featured');
    return response.data;
  },

  search: async (query: string): Promise<ApiResponse<Hotel[]>> => {
    const response = await api.get('/hotels/search', { params: { q: query } });
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

export default api;
