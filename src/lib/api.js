import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401/403
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('doctor');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginDoctor = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Patients
export const getPatients = (params) => api.get('/patients', { params });
export const getPatient = (id) => api.get(`/patients/${id}`);
export const createPatient = (data) => api.post('/patients', data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// Visits / Case Studies
export const getVisits = (params) => api.get('/visits', { params });
export const getVisit = (id) => api.get(`/visits/${id}`);
export const createVisit = (data) => api.post('/visits', data);
export const updateVisit = (id, data) => api.put(`/visits/${id}`, data);
export const deleteVisit = (id) => api.delete(`/visits/${id}`);

// Appointments
export const getAppointments = (params) => api.get('/appointments', { params });
export const getTodayAppointments = () => api.get('/appointments/today');
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// Google API
export const getGoogleAuthUrl = () => api.get('/google/auth-url');

export default api;
