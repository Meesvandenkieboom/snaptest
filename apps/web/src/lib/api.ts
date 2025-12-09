import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Account,
  CreateAccountRequest,
  Video,
  Job,
  CreateJobRequest,
  Proxy,
  BulkUploadResponse,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),
};

// Accounts API
export const accountsApi = {
  getAll: (filters?: { status?: string }) =>
    api.get<Account[]>('/accounts', { params: filters }),

  getOne: (id: string) =>
    api.get<Account>(`/accounts/${id}`),

  create: (data: CreateAccountRequest) =>
    api.post<Account>('/accounts', data),

  bulkCreate: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<BulkUploadResponse>('/accounts/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: string, data: Partial<CreateAccountRequest>) =>
    api.patch<Account>(`/accounts/${id}`, data),

  delete: (id: string) =>
    api.delete(`/accounts/${id}`),

  login: (id: string) =>
    api.post<{ success: boolean }>(`/accounts/${id}/login`),

  warmup: (id: string) =>
    api.post<Job>(`/accounts/${id}/warmup`),
};

// Videos API
export const videosApi = {
  getAll: (filters?: { status?: string }) =>
    api.get<Video[]>('/videos', { params: filters }),

  getOne: (id: string) =>
    api.get<Video>(`/videos/${id}`),

  upload: (file: File, metadata?: { title?: string; description?: string; tags?: string[] }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return api.post<Video>('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: string, data: { title?: string; description?: string; tags?: string[] }) =>
    api.patch<Video>(`/videos/${id}`, data),

  delete: (id: string) =>
    api.delete(`/videos/${id}`),
};

// Jobs API
export const jobsApi = {
  getAll: (filters?: { status?: string; accountId?: string }) =>
    api.get<Job[]>('/jobs', { params: filters }),

  getOne: (id: string) =>
    api.get<Job>(`/jobs/${id}`),

  create: (data: CreateJobRequest) =>
    api.post<Job[]>('/jobs', data),

  retry: (id: string) =>
    api.post<Job>(`/jobs/${id}/retry`),

  cancel: (id: string) =>
    api.post<Job>(`/jobs/${id}/cancel`),

  getLogs: (id: string) =>
    api.get<{ logs: any[]; screenshots: string[] }>(`/jobs/${id}/logs`),
};

// Proxies API
export const proxiesApi = {
  getAll: () =>
    api.get<Proxy[]>('/proxies'),

  getOne: (id: string) =>
    api.get<Proxy>(`/proxies/${id}`),

  create: (data: { host: string; port: number; username?: string; password?: string; protocol?: string; country?: string }) =>
    api.post<Proxy>('/proxies', data),

  bulkCreate: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<BulkUploadResponse>('/proxies/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: string, data: any) =>
    api.patch<Proxy>(`/proxies/${id}`, data),

  delete: (id: string) =>
    api.delete(`/proxies/${id}`),

  checkHealth: (id: string) =>
    api.post<{ healthy: boolean }>(`/proxies/${id}/check`),
};
