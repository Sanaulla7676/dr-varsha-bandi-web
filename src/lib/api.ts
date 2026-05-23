import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401/403 or logout if expired
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as CustomAxiosRequestConfig;
    
    // Check if unauthorized, not retried yet, and we have a refresh token
    if (err.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken') || useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          // Attempt silent token refresh
          const response = await axios.post<{ token: string; refreshToken?: string }>(
            `${API_BASE}/auth/refresh`,
            { refreshToken }
          );

          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          
          // Update Zustand store and localStorage
          useAuthStore.setState({ token: newToken });
          localStorage.setItem('token', newToken);
          if (newRefreshToken) {
            useAuthStore.setState({ refreshToken: newRefreshToken });
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // Resend original failed request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          console.error('Refresh token expired or invalid:', refreshErr);
          // If refresh fails, log out
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        }
      } else {
        // No refresh token available, logout directly
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(err);
  }
);

// Auth API types & calls
export const loginDoctor = (data: any) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Dashboard API
export const getDashboardStats = () => api.get('/dashboard/stats');

// Patients API
export const getPatients = (params?: any) => api.get('/patients', { params });
export const getPatient = (id: string) => api.get(`/patients/${id}`);
export const createPatient = (data: any) => api.post('/patients', data);
export const updatePatient = (id: string, data: any) => api.put(`/patients/${id}`, data);
export const deletePatient = (id: string) => api.delete(`/patients/${id}`);

// Visits / Case Studies API
export const getVisits = (params?: any) => api.get('/visits', { params });
export const getVisit = (id: string) => api.get(`/visits/${id}`);
export const createVisit = (data: any) => api.post('/visits', data);
export const updateVisit = (id: string, data: any) => api.put(`/visits/${id}`, data);
export const deleteVisit = (id: string) => api.delete(`/visits/${id}`);

// Appointments API
export const getAppointments = (params?: any) => api.get('/appointments', { params });
export const getTodayAppointments = () => api.get('/appointments/today');
export const createAppointment = (data: any) => api.post('/appointments', data);
export const updateAppointment = (id: string, data: any) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id: string) => api.delete(`/appointments/${id}`);

// Google API
export const getGoogleAuthUrl = () => api.get('/google/auth-url');

// Books API
export const getBooks = (params?: any) => api.get('/books', { params });
export const uploadBook = (formData: FormData) => api.post('/books/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const renameBook = (id: string, title: string) => api.put(`/books/${id}`, { title });
export const deleteBook = (id: string) => api.delete(`/books/${id}`);

export default api;
