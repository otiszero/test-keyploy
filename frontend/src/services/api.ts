import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    api.post<{ message: string; userId: string }>('/auth/register', { email, password, displayName }),
  login: (email: string, password: string) =>
    api.post<{ accessToken: string }>('/auth/login', { email, password }),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, newPassword }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }),
};

export const userApi = {
  getProfile: () => api.get<{ id: string; email: string; displayName: string; createdAt: string }>('/users/profile'),
  updateProfile: (displayName: string) =>
    api.patch<{ id: string; email: string; displayName: string; createdAt: string }>('/users/profile', { displayName }),
};

export const chatApi = {
  getRecentMessages: (limit: number = 50) =>
    api.get<Array<{ id: string; content: string; senderDisplayName: string; senderId: string; createdAt: string }>>(
      `/chat/messages?limit=${limit}`
    ),
};

export default api;
