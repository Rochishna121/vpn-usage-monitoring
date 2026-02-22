const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock JWT token
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJkZW1vQGV4YW1wbGUuY29tIiwiaWF0IjoxNjQ1NDY2NDAwLCJleHAiOjk5OTk5OTk5OTl9.demo-token';

// Mock authentication middleware check (simple for demo)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // For demo, accept any Bearer token
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  next();
};

// ============ AUTHENTICATION ENDPOINTS ============

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password required',
    });
  }

  // Mock authentication - accept any credentials
  res.json({
    success: true,
    data: {
      token: MOCK_TOKEN,
      user: {
        id: 'user123',
        name: 'Demo User',
        email: email,
        createdAt: '2024-01-15T10:30:00Z',
      },
    },
  });
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Refresh token
app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      token: MOCK_TOKEN,
      user: {
        id: 'user123',
        name: 'Demo User',
        email: 'demo@example.com',
        createdAt: '2024-01-15T10:30:00Z',
      },
    },
  });
});

// ============ USAGE ENDPOINTS ============

// Get usage stats
app.get('/api/usage/stats', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      currentSpeed: {
        upload: Math.floor(Math.random() * 5242880) + 1048576, // 1-5 MB/s
        download: Math.floor(Math.random() * 10485760) + 2097152, // 2-10 MB/s
      },
      todayUsage: (Math.random() * 10 + 2).toFixed(2),
      weekUsage: (Math.random() * 50 + 20).toFixed(2),
      monthUsage: (Math.random() * 200 + 100).toFixed(2),
      averageSpeed: (Math.random() * 50 + 30).toFixed(2),
    },
  });
});

// Get usage history
app.get('/api/usage/history', authenticateToken, (req, res) => {
  const range = req.query.range || 'daily';
  const data = [];

  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(Date.now() - i * 3600000).toISOString();
    data.push({
      timestamp,
      uploadSpeed: Math.floor(Math.random() * 5242880) + 1048576,
      downloadSpeed: Math.floor(Math.random() * 10485760) + 2097152,
      totalDataUsed: (Math.random() * 5 + 0.5).toFixed(2),
      isConnected: Math.random() > 0.2,
    });
  }

  res.json({
    success: true,
    data: data.reverse(),
  });
});

// Get current usage
app.get('/api/usage/current', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      uploadSpeed: Math.floor(Math.random() * 5242880) + 1048576,
      downloadSpeed: Math.floor(Math.random() * 10485760) + 2097152,
      totalDataUsed: (Math.random() * 10 + 2).toFixed(2),
      isConnected: true,
    },
  });
});

// ============ CONNECTION ENDPOINTS ============

// Get connection logs
app.get('/api/connections/logs', authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const statuses = ['connected', 'disconnected', 'failed'];
  const locations = ['New York', 'London', 'Tokyo', 'Sydney', 'Toronto', 'Amsterdam'];
  const data = [];

  for (let i = 0; i < Math.min(limit, 50); i++) {
    const timestamp = new Date(Date.now() - i * 3600000).toISOString();
    data.push({
      id: `conn${i}`,
      timestamp,
      serverLocation: locations[Math.floor(Math.random() * locations.length)],
      ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      dataUsed: (Math.random() * 1000 + 100).toFixed(2),
      duration: Math.floor(Math.random() * 7200) + 600,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  res.json({
    success: true,
    data,
  });
});

// Get connection stats
app.get('/api/connections/stats', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      totalConnections: Math.floor(Math.random() * 500) + 100,
      successRate: (Math.random() * 10 + 90).toFixed(1),
      averageDuration: Math.floor(Math.random() * 3600) + 900,
    },
  });
});

// ============ SERVER ENDPOINTS ============

// Get available servers
app.get('/api/servers/available', (req, res) => {
  const servers = [
    {
      id: 'server1',
      name: 'NY-01',
      location: 'New York, USA',
      country: 'United States',
      ip: '104.21.45.67',
      load: Math.floor(Math.random() * 100),
      protocol: 'OpenVPN',
      ping: Math.floor(Math.random() * 50) + 20,
      status: 'online',
    },
    {
      id: 'server2',
      name: 'LON-01',
      location: 'London, UK',
      country: 'United Kingdom',
      ip: '93.184.216.34',
      load: Math.floor(Math.random() * 100),
      protocol: 'WireGuard',
      ping: Math.floor(Math.random() * 50) + 30,
      status: 'online',
    },
    {
      id: 'server3',
      name: 'TYO-01',
      location: 'Tokyo, Japan',
      country: 'Japan',
      ip: '203.0.113.45',
      load: Math.floor(Math.random() * 100),
      protocol: 'OpenVPN',
      ping: Math.floor(Math.random() * 50) + 80,
      status: 'online',
    },
    {
      id: 'server4',
      name: 'SYD-01',
      location: 'Sydney, Australia',
      country: 'Australia',
      ip: '192.0.2.123',
      load: Math.floor(Math.random() * 100),
      protocol: 'WireGuard',
      ping: Math.floor(Math.random() * 50) + 150,
      status: 'online',
    },
    {
      id: 'server5',
      name: 'TOR-01',
      location: 'Toronto, Canada',
      country: 'Canada',
      ip: '198.51.100.56',
      load: Math.floor(Math.random() * 100),
      protocol: 'OpenVPN',
      ping: Math.floor(Math.random() * 50) + 40,
      status: 'online',
    },
    {
      id: 'server6',
      name: 'AMS-01',
      location: 'Amsterdam, Netherlands',
      country: 'Netherlands',
      ip: '198.19.255.1',
      load: Math.floor(Math.random() * 100),
      protocol: 'WireGuard',
      ping: Math.floor(Math.random() * 50) + 25,
      status: 'online',
    },
  ];

  res.json({
    success: true,
    data: servers,
  });
});

// Get server locations
app.get('/api/servers/locations', (req, res) => {
  res.json({
    success: true,
    data: [
      'New York, USA',
      'London, UK',
      'Tokyo, Japan',
      'Sydney, Australia',
      'Toronto, Canada',
      'Amsterdam, Netherlands',
    ],
  });
});

// Get recommended server
app.get('/api/servers/recommended', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'server1',
      name: 'NY-01',
      location: 'New York, USA',
      country: 'United States',
      ip: '104.21.45.67',
      load: 25,
      protocol: 'OpenVPN',
      ping: 20,
      status: 'online',
    },
  });
});

// ============ ACCOUNT ENDPOINTS ============

// Get profile
app.get('/api/account/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'user123',
      email: 'demo@example.com',
      name: 'Demo User',
      subscriptionPlan: 'premium',
      subscriptionExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString(),
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: new Date().toISOString(),
      totalDataUsed: (Math.random() * 500 + 100).toFixed(2),
    },
  });
});

// Update profile
app.put('/api/account/profile', authenticateToken, (req, res) => {
  const { name, email } = req.body;

  res.json({
    success: true,
    data: {
      id: 'user123',
      email: email || 'demo@example.com',
      name: name || 'Demo User',
      subscriptionPlan: 'premium',
      subscriptionExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString(),
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: new Date().toISOString(),
      totalDataUsed: 250.5,
    },
  });
});

// Change password
app.post('/api/account/change-password', authenticateToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Old and new passwords required',
    });
  }

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// Delete account
app.post('/api/account/delete', authenticateToken, (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password required',
    });
  }

  res.json({
    success: true,
    message: 'Account deleted successfully',
  });
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Mock backend server is running' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`
🚀 Mock VPN Backend Server Running!
📍 Base URL: http://localhost:${PORT}/api
🔑 Token: ${MOCK_TOKEN}

Ready to accept frontend requests!
Use any email/password to login.
Press Ctrl+C to stop.
  `);
});
