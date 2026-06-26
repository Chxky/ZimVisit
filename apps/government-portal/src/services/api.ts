import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zimvisit_gov_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('zimvisit_gov_token');
      if (!token || !token.startsWith('mock-')) {
        localStorage.removeItem('zimvisit_gov_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;

export const bookingsApi = {
  getRevenueStats: (params?: any) => api.get('/bookings/stats/revenue', { params }),
  getComplianceStats: () => api.get('/bookings/stats/compliance'),
};
export const complianceApi = {
  getLeakage: (params?: any) => api.get('/compliance/leakage', { params }),
};
