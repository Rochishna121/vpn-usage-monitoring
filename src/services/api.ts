import axios, { AxiosInstance } from 'axios';
import {
  LoginCredentials,
  AuthResponse,
  UsageStats,
  UsageData,
  ConnectionLog,
  VPNServer,
  AccountProfile,
  ApiResponse,
} from '@/types/index';

class APIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Replace with your actual Google Cloud backend URL
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://34.98.5.27:8080/api';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('vpn_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('vpn_token');
          localStorage.removeItem('vpn_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Login failed');
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      localStorage.removeItem('vpn_token');
      localStorage.removeItem('vpn_user');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      '/auth/refresh'
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Token refresh failed');
  }

  // Usage endpoints
  async getUsageStats(): Promise<UsageStats> {
    const response = await this.client.get<ApiResponse<UsageStats>>(
      '/usage/stats'
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch usage stats');
  }

  async getUsageHistory(
    timeRange: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UsageData[]> {
    const response = await this.client.get<ApiResponse<UsageData[]>>(
      `/usage/history?range=${timeRange}`
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch usage history');
  }

  async getCurrentUsage(): Promise<UsageData> {
    const response = await this.client.get<ApiResponse<UsageData>>(
      '/usage/current'
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch current usage');
  }

  // Connection log endpoints
  async getConnectionLogs(limit: number = 50): Promise<ConnectionLog[]> {
    const response = await this.client.get<ApiResponse<ConnectionLog[]>>(
      `/connections/logs?limit=${limit}`
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch connection logs');
  }

  async getConnectionStats(): Promise<{
    totalConnections: number;
    successRate: number;
    averageDuration: number;
  }> {
    const response = await this.client.get<
      ApiResponse<{
        totalConnections: number;
        successRate: number;
        averageDuration: number;
      }>
    >('/connections/stats');
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch connection stats');
  }

  // Server endpoints
  async getAvailableServers(): Promise<VPNServer[]> {
    const response = await this.client.get<ApiResponse<VPNServer[]>>(
      '/servers/available'
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch available servers');
  }

  async getServerLocations(): Promise<string[]> {
    const response = await this.client.get<ApiResponse<string[]>>(
      '/servers/locations'
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch server locations');
  }

  async getRecommendedServer(): Promise<VPNServer> {
    const response = await this.client.get<ApiResponse<VPNServer>>(
      '/servers/recommended'
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch recommended server');
  }

  // Account endpoints
  async getAccountProfile(): Promise<AccountProfile> {
    const response = await this.client.get<ApiResponse<AccountProfile>>(
      '/account/profile'
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch account profile');
  }

  async updateProfile(data: Partial<AccountProfile>): Promise<AccountProfile> {
    const response = await this.client.put<ApiResponse<AccountProfile>>(
      '/account/profile',
      data
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to update profile');
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const response = await this.client.post<ApiResponse<{ success: boolean }>>(
      '/account/change-password',
      { oldPassword, newPassword }
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to change password');
  }

  async deleteAccount(password: string): Promise<{ success: boolean }> {
    const response = await this.client.post<ApiResponse<{ success: boolean }>>(
      '/account/delete',
      { password }
    );
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to delete account');
  }
}

export const apiClient = new APIClient();
