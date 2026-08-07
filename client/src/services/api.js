import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://skillsphere-cuyg.onrender.com');

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
    const isAuthRoute =
      error.config?.url?.includes('/api/auth/login') ||
      error.config?.url?.includes('/api/auth/register');

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('skillsphere_token');
      localStorage.removeItem('skillsphere_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};
// --- Users ---
export const userService = {
  getProfile: (id) => api.get(`/api/users/${id}`),
  updateProfile: (data) => api.put('/api/users/profile', data),
  uploadAvatar: (formData) =>
    api.post('/api/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  searchUsers: (params) => api.get('/api/users', { params }),
};

// --- Skills ---
export const skillService = {
  getSkills: () => api.get('/api/skills'),
  addSkill: (data) => api.post('/api/skills', data),
  updateSkill: (skillId, data) => api.put(`/api/skills/${skillId}`, data),
  deleteSkill: (skillId, type) =>
    api.delete(`/api/skills/${skillId}`, { data: { type } }),
};

// --- Requests ---
export const requestService = {
  getRequests: (params) => api.get('/api/requests', { params }),
  sendRequest: (data) => api.post('/api/requests', data),
  acceptRequest: (id) => api.put(`/api/requests/${id}/accept`),
  rejectRequest: (id) => api.put(`/api/requests/${id}/reject`),
};

// --- Sessions ---
export const sessionService = {
  getSessions: (params) => api.get('/api/sessions', { params }),
  updateSession: (id, data) => api.put(`/api/sessions/${id}`, data),
  completeSession: (id) => api.put(`/api/sessions/${id}/complete`),
  cancelSession: (id) => api.put(`/api/sessions/${id}/cancel`),
};

// --- Reviews ---
export const reviewService = {
  addReview: (data) => api.post('/api/reviews', data),
  getReviews: (userId, params) => api.get(`/api/reviews/${userId}`, { params }),
  getMyReviews: () => api.get('/api/reviews/my'),
};

// --- Admin ---
export const adminService = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
};
