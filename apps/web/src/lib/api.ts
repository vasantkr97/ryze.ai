import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (zustand persist)
    const authStorage = localStorage.getItem('ryze-auth');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
        if (state?.currentWorkspaceId) {
          config.headers['x-workspace-id'] = state.currentWorkspaceId;
        }
      } catch {
        // Ignore parsing errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStorage = localStorage.getItem('ryze-auth');
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          if (state?.refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken: state.refreshToken,
            });

            const { accessToken, refreshToken } = response.data.data;

            // Update localStorage
            const newState = {
              ...state,
              accessToken,
              refreshToken,
            };
            localStorage.setItem('ryze-auth', JSON.stringify({ state: newState }));

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch {
        // Refresh failed, clear auth and redirect to login
        localStorage.removeItem('ryze-auth');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API helpers
export const apiGet = <T>(url: string) => api.get<{ success: boolean; data: T }>(url);
export const apiPost = <T>(url: string, data?: unknown) =>
  api.post<{ success: boolean; data: T }>(url, data);
export const apiPatch = <T>(url: string, data?: unknown) =>
  api.patch<{ success: boolean; data: T }>(url, data);
export const apiDelete = <T>(url: string) => api.delete<{ success: boolean; data: T }>(url);
