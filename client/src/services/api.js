import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillsphere_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 (expired/invalid token)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillsphere_token');
      localStorage.removeItem('skillsphere_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// --- Users ---
export const userService = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  searchUsers: (params) => api.get('/users', { params }),
};

// --- Skills ---
export const skillService = {
  getSkills: () => api.get('/skills'),
  addSkill: (data) => api.post('/skills', data),
  updateSkill: (skillId, data) => api.put(`/skills/${skillId}`, data),
  deleteSkill: (skillId, type) => api.delete(`/skills/${skillId}`, { data: { type } }),
};

// --- Requests ---
export const requestService = {
  getRequests: (params) => api.get('/requests', { params }),
  sendRequest: (data) => api.post('/requests', data),
  acceptRequest: (id) => api.put(`/requests/${id}/accept`),
  rejectRequest: (id) => api.put(`/requests/${id}/reject`),
};

// --- Sessions ---
export const sessionService = {
  getSessions: (params) => api.get('/sessions', { params }),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  completeSession: (id) => api.put(`/sessions/${id}/complete`),
  cancelSession: (id) => api.put(`/sessions/${id}/cancel`),
};

// --- Reviews ---
export const reviewService = {
  addReview: (data) => api.post('/reviews', data),
  getReviews: (userId, params) => api.get(`/reviews/${userId}`, { params }),
  getMyReviews: () => api.get('/reviews/my'),
};

// --- Admin ---
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
