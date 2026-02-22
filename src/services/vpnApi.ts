import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: 'free' | 'premium' | 'business';
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

export interface UsageStats {
  currentSpeed: { upload: number; download: number };
  todayUsage: number;
  weekUsage: number;
  monthUsage: number;
  averageSpeed: number;
}

export interface ConnectionLog {
  id: string;
  timestamp: string;
  serverLocation: string;
  ipAddress: string;
  dataUsed: number;
  duration: number;
  status: 'connected' | 'disconnected' | 'failed';
}

export interface Server {
  id: string;
  name: string;
  location: string;
  country: string;
  ip: string;
  load: number;
  protocol: string;
  ping: number;
  status: 'online' | 'offline';
}

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: 'free' | 'premium' | 'business';
  subscriptionExpiry: string;
  createdAt: string;
  lastLogin: string;
  totalDataUsed: number;
}


export interface VPNStatus {
  isConnected: boolean;
  connectionId?: string;
  serverId?: string;
  connectionTime?: number;
  dataUsed?: number;
}

class VPNApiClient {
  // Authentication endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  }

  // User endpoints
  async getUserProfile(userId?: string): Promise<AccountProfile> {
    const url = userId ? `/user/profile?userId=${userId}` : '/user/profile';
    const response = await apiClient.get<AccountProfile>(url);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post('/user/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  }

  // Usage endpoints
  async getUsageStats(): Promise<UsageStats> {
    const response = await apiClient.get<UsageStats>('/usage/stats');
    return response.data;
  }

  async getUsageTrends(): Promise<any[]> {
    const response = await apiClient.get('/usage/trends');
    return response.data;
  }

  // VPN endpoints
  async startVPN(serverId?: string): Promise<{ connectionId: string; status: string; startTime: string }> {
    const response = await apiClient.post('/vpn/start', { serverId });
    return response.data;
  }

  async stopVPN(connectionId: string): Promise<{ status: string; duration: number; dataUsed: number }> {
    const response = await apiClient.post('/vpn/stop', { connectionId });
    return response.data;
  }

  async getVPNStatus(): Promise<VPNStatus> {
    const response = await apiClient.get<VPNStatus>('/vpn/status');
    return response.data;
  }

  // Connection endpoints
  async getConnectionLogs(): Promise<ConnectionLog[]> {
    const response = await apiClient.get<ConnectionLog[]>('/connections/logs');
    return response.data;
  }

  // Server endpoints
  async getAvailableServers(): Promise<Server[]> {
    const response = await apiClient.get<Server[]>('/servers');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  }
}

export const vpnApiClient = new VPNApiClient();
export default apiClient;
