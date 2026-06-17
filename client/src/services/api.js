// Axios instance with base URL and interceptors for API calls

import axios from 'axios';

// Create an Axios instance that points to our backend API
const api = axios.create({
  baseURL: '/api',
});

// Attach the auth token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally — clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginApi = (data) => api.post('/auth/login', data);
export const registerApi = (data) => api.post('/auth/register', data);
export const getMeApi = () => api.get('/auth/me');

// Machines
export const getMachines = (params) => api.get('/machines', { params });
export const getMachine = (id) => api.get(`/machines/${id}`);
export const createMachine = (data) => api.post('/machines', data);
export const updateMachine = (id, data) => api.put(`/machines/${id}`, data);
export const deleteMachine = (id) => api.delete(`/machines/${id}`);

// Schedules
export const getSchedules = () => api.get('/schedules');
export const createSchedule = (data) => api.post('/schedules', data);
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

// Work Orders
export const getWorkOrders = (params) => api.get('/work-orders', { params });
export const getWorkOrder = (id) => api.get(`/work-orders/${id}`);
export const createWorkOrder = (data) => api.post('/work-orders', data);
export const assignTechnician = (id, data) => api.put(`/work-orders/${id}/assign`, data);
export const updateWorkOrderStatus = (id, data) => api.put(`/work-orders/${id}/status`, data);
export const deleteWorkOrder = (id) => api.delete(`/work-orders/${id}`);

// History
export const getHistory = () => api.get('/history');

// Logs
export const getLogs = () => api.get('/logs');

// Users
export const getUsers = (params) => api.get('/users', { params });

// Dashboard
export const getDashboardStats = () => api.get('/dashboard');

export default api;
