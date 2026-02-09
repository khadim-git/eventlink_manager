import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const createService = (endpoint) => ({
  getAll: (params) => api.get(endpoint, { params }),
  getById: (id) => api.get(`${endpoint}/${id}`),
  create: (data) => api.post(endpoint, data),
  update: (id, data) => api.put(`${endpoint}/${id}`, data),
  delete: (id) => api.delete(`${endpoint}/${id}`)
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials)
};

export const websiteService = {
  ...createService('/websites'),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/websites/import/csv', formData);
  }
};

export const userService = createService('/users');

export const eventService = {
  ...createService('/events'),
  getUpcoming: () => api.get('/events/upcoming'),
  getLinkedWebsites: (eventCode) => api.get(`/events/${eventCode}/websites`),
  sync: (events) => api.post('/events/sync', { events }),
  getPendingChanges: () => api.get('/events/changes/pending'),
  approveChange: (id, status) => api.put(`/events/changes/${id}`, { status }),
  linkToWebsite: (data) => api.post('/events/link', data),
  checkMyWebsites: (eventName) => api.post('/events/check-my-websites', { eventName }),
  updateEventDateOnWebsite: (data) => api.post('/events/update-date-on-website', data)
};

export default api;
