// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// VPN Usage Types
export interface UsageData {
  timestamp: string;
  uploadSpeed: number; // bytes per second
  downloadSpeed: number; // bytes per second
  totalDataUsed: number; // in GB
  isConnected: boolean;
}

export interface UsageStats {
  currentSpeed: {
    upload: number;
    download: number;
  };
  todayUsage: number; // in GB
  weekUsage: number; // in GB
  monthUsage: number; // in GB
  averageSpeed: number; // Mbps
}

// Connection Log Types
export interface ConnectionLog {
  id: string;
  timestamp: string;
  serverLocation: string;
  ipAddress: string;
  dataUsed: number; // in MB
  duration: number; // in seconds
  status: 'connected' | 'disconnected' | 'failed';
}

// Server Types
export interface VPNServer {
  id: string;
  name: string;
  location: string;
  country: string;
  ip: string;
  load: number; // percentage 0-100
  protocol: string;
  ping: number; // in ms
  status: 'online' | 'offline';
}

// Account Types
export interface AccountProfile {
  id: string;
  email: string;
  name: string;
  subscriptionPlan: 'free' | 'premium' | 'enterprise';
  subscriptionExpiry: string;
  createdAt: string;
  lastLogin: string;
  totalDataUsed: number; // in GB
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    fill: boolean;
    tension: number;
  }[];
}
