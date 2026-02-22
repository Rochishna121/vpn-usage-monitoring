// Demo data for standalone frontend - no backend needed

export const demoUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-15T10:30:00Z',
};

export const demoUsageStats = {
  currentSpeed: {
    upload: 5242880,
    download: 10485760,
  },
  todayUsage: 5.32,
  weekUsage: 35.67,
  monthUsage: 142.89,
  averageSpeed: 45.2,
};

export const demoConnectionLogs = [
  {
    id: 'conn1',
    timestamp: new Date(Date.now() - 0 * 3600000).toISOString(),
    serverLocation: 'New York, USA',
    ipAddress: '104.21.45.67',
    dataUsed: 512.5,
    duration: 3600,
    status: 'connected' as const,
  },
  {
    id: 'conn2',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    serverLocation: 'London, UK',
    ipAddress: '93.184.216.34',
    dataUsed: 428.2,
    duration: 2400,
    status: 'disconnected' as const,
  },
  {
    id: 'conn3',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    serverLocation: 'Tokyo, Japan',
    ipAddress: '203.0.113.45',
    dataUsed: 645.8,
    duration: 7200,
    status: 'connected' as const,
  },
  {
    id: 'conn4',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    serverLocation: 'Sydney, Australia',
    ipAddress: '192.0.2.123',
    dataUsed: 389.1,
    duration: 1800,
    status: 'failed' as const,
  },
  {
    id: 'conn5',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    serverLocation: 'Toronto, Canada',
    ipAddress: '198.51.100.56',
    dataUsed: 756.3,
    duration: 5400,
    status: 'connected' as const,
  },
];

export const demoServers = [
  {
    id: 'server1',
    name: 'NY-01',
    location: 'New York, USA',
    country: 'United States',
    ip: '104.21.45.67',
    load: 35,
    protocol: 'OpenVPN',
    ping: 20,
    status: 'online' as const,
  },
  {
    id: 'server2',
    name: 'LON-01',
    location: 'London, UK',
    country: 'United Kingdom',
    ip: '93.184.216.34',
    load: 45,
    protocol: 'WireGuard',
    ping: 32,
    status: 'online' as const,
  },
  {
    id: 'server3',
    name: 'TYO-01',
    location: 'Tokyo, Japan',
    country: 'Japan',
    ip: '203.0.113.45',
    load: 62,
    protocol: 'OpenVPN',
    ping: 85,
    status: 'online' as const,
  },
  {
    id: 'server4',
    name: 'SYD-01',
    location: 'Sydney, Australia',
    country: 'Australia',
    ip: '192.0.2.123',
    load: 28,
    protocol: 'WireGuard',
    ping: 155,
    status: 'online' as const,
  },
  {
    id: 'server5',
    name: 'TOR-01',
    location: 'Toronto, Canada',
    country: 'Canada',
    ip: '198.51.100.56',
    load: 40,
    protocol: 'OpenVPN',
    ping: 42,
    status: 'online' as const,
  },
  {
    id: 'server6',
    name: 'AMS-01',
    location: 'Amsterdam, Netherlands',
    country: 'Netherlands',
    ip: '198.19.255.1',
    load: 55,
    protocol: 'WireGuard',
    ping: 28,
    status: 'online' as const,
  },
];

export const demoProfile = {
  id: 'user123',
  email: 'john@example.com',
  name: 'John Doe',
  subscriptionPlan: 'premium' as const,
  subscriptionExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: '2024-01-15T10:30:00Z',
  lastLogin: new Date().toISOString(),
  totalDataUsed: 542.15,
};

// Usage trend data for charts
export const demoUsageTrend = [
  { hour: '00:00', upload: 50, download: 120, dataUsed: 2.5 },
  { hour: '04:00', upload: 35, download: 85, dataUsed: 1.8 },
  { hour: '08:00', upload: 120, download: 250, dataUsed: 5.2 },
  { hour: '12:00', upload: 95, download: 180, dataUsed: 4.1 },
  { hour: '16:00', upload: 140, download: 320, dataUsed: 6.8 },
  { hour: '20:00', upload: 160, download: 380, dataUsed: 7.5 },
  { hour: '23:00', upload: 75, download: 150, dataUsed: 3.2 },
];

// Weekly usage data
export const demoWeeklyUsage = [
  { day: 'Mon', usage: 28.5 },
  { day: 'Tue', usage: 31.2 },
  { day: 'Wed', usage: 25.8 },
  { day: 'Thu', usage: 35.1 },
  { day: 'Fri', usage: 42.3 },
  { day: 'Sat', usage: 38.9 },
  { day: 'Sun', usage: 32.4 },
];

// Server speed data
export const demoServerSpeed = [
  { server: 'NY-01', download: 245, upload: 89 },
  { server: 'LON-01', download: 198, upload: 72 },
  { server: 'TYO-01', download: 156, upload: 58 },
  { server: 'SYD-01', download: 287, upload: 95 },
  { server: 'TOR-01', download: 213, upload: 81 },
  { server: 'AMS-01', download: 267, upload: 92 },
];
