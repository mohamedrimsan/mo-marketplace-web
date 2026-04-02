import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://mo-marketplace-api-production.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Request interceptor — attach token ──────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('mo_token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 globally ──────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {

      let token: string | null = null;
      try {
        const blob = localStorage.getItem('mo-auth-storage');
        if (blob) token = JSON.parse(blob)?.state?.token ?? null;
      } catch {
        token = null;
      }

      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Typed helper to extract error message ───────────────────────────────────
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message;
    }
    if (error.message === 'Network Error') return 'Network error — check your connection.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export default api;
