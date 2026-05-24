import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Articles
export const articleApi = {
  getList: (page = 0, size = 10, tag) =>
    api.get('/articles', { params: { page, size, tag } }),
  getById: (id) => api.get(`/articles/${id}`),
  search: (keyword, page = 0, size = 10) =>
    api.get('/articles/search', { params: { keyword, page, size } }),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  getMine: (page = 0, size = 10) => api.get('/articles/mine', { params: { page, size } }),
};

// Projects
export const projectApi = {
  getList: (page = 0, size = 10, tag) =>
    api.get('/projects', { params: { page, size, tag } }),
  getById: (id) => api.get(`/projects/${id}`),
  search: (keyword, page = 0, size = 10) =>
    api.get('/projects/search', { params: { keyword, page, size } }),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Comments
export const commentApi = {
  getByTarget: (targetType, targetId, page = 0) =>
    api.get('/comments', { params: { targetType, targetId, page } }),
  create: (data) => api.post('/comments', data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Likes
export const likeApi = {
  toggle: (targetType, targetId) =>
    api.post('/likes/toggle', { targetType, targetId }),
};

// Site
export const siteApi = {
  getConfig: () => api.get('/site/config'),
  getStats: () => api.get('/site/stats'),
  recordVisit: () => api.post('/site/visit'),
};

// Admin
export const adminApi = {
  getUsers: (page = 0, size = 20) => api.get('/admin/users', { params: { page, size } }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getArticles: (page = 0, size = 20) => api.get('/admin/articles', { params: { page, size } }),
  getProjects: (page = 0, size = 20) => api.get('/admin/projects', { params: { page, size } }),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
  updateConfig: (configs) => api.put('/admin/config', configs),
};
