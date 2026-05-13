import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zimvisit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zimvisit_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;

export const bookingsApi = {
  list: (params?: any) => api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  getByReference: (ref: string) => api.get(`/bookings/reference/${ref}`),
  updateStatus: (id: string, data: any) => api.put(`/bookings/${id}`, data),
};

export const inventoryApi = {
  listTours: () => api.get('/inventory/tours'),
  getTour: (id: string) => api.get(`/inventory/tours/${id}`),
  createTour: (data: any) => api.post('/inventory/tours', data),
  updateTour: (id: string, data: any) => api.put(`/inventory/tours/${id}`, data),
  listHotels: () => api.get('/inventory/hotels'),
  getHotel: (id: string) => api.get(`/inventory/hotels/${id}`),
  createHotel: (data: any) => api.post('/inventory/hotels', data),
  updateHotel: (id: string, data: any) => api.put(`/inventory/hotels/${id}`, data),
};

export const complianceApi = {
  getOperatorCompliance: (operatorId: string) => api.get(`/compliance/operator/${operatorId}`),
};

export const notificationsApi = {
  list: (params?: any) => api.get('/notifications', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const gdsApi = {
  searchFlights: (params: any) => api.get('/gds/flights/search', { params }),
};

export const fingerprintingApi = {
  list: (params?: any) => api.get('/ai/fingerprinting/agents', { params }),
  getAgent: (agentId: string) => api.get(`/ai/fingerprinting/agents/${agentId}`),
  getStats: () => api.get('/ai/fingerprinting/stats'),
};
