const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbPath = path.join(__dirname, 'vpn_monitor.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        subscriptionPlan TEXT DEFAULT 'premium',
        subscriptionExpiry TEXT,
        totalDataUsed REAL DEFAULT 0,
        createdAt TEXT,
        lastLogin TEXT
      )
    `);

    // Active connections table
    db.run(`
      CREATE TABLE IF NOT EXISTS connections (
        id TEXT PRIMARY KEY,
        userId TEXT,
        serverId TEXT,
        startTime TEXT,
        endTime TEXT,
        duration INTEGER DEFAULT 0,
        dataUsed REAL DEFAULT 0,
        status TEXT DEFAULT 'connected',
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);

    // Connection logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS connection_logs (
        id TEXT PRIMARY KEY,
        userId TEXT,
        timestamp TEXT,
        serverLocation TEXT,
        ipAddress TEXT,
        dataUsed REAL,
        duration INTEGER,
        status TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);

    // Usage stats table
    db.run(`
      CREATE TABLE IF NOT EXISTS usage_stats (
        id TEXT PRIMARY KEY,
        userId TEXT UNIQUE,
        todayUsage REAL DEFAULT 0,
        weekUsage REAL DEFAULT 0,
        monthUsage REAL DEFAULT 0,
        uploadSpeed REAL DEFAULT 0,
        downloadSpeed REAL DEFAULT 0,
        averageSpeed REAL DEFAULT 0,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);

    // Create default user if not exists
    const defaultUserId = 'user_default_123';
    db.get('SELECT * FROM users WHERE id = ?', [defaultUserId], (err, row) => {
      if (!row) {
        db.run(
          `INSERT INTO users (id, name, email, password, subscriptionPlan, subscriptionExpiry, createdAt, lastLogin)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            defaultUserId,
            'John Doe',
            'john@example.com',
            'password123',
            'premium',
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            '2024-01-15T10:30:00Z',
            new Date().toISOString(),
          ]
        );

        // Create default usage stats
        db.run(
          `INSERT INTO usage_stats (id, userId, todayUsage, weekUsage, monthUsage, uploadSpeed, downloadSpeed, averageSpeed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), defaultUserId, 5.32, 35.67, 142.89, 5242880, 10485760, 45.2]
        );
      }
    });



    console.log('Database tables initialized');
  });
}

// Default user ID (in production, use authentication)
const DEFAULT_USER_ID = 'user_default_123';

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VPN Backend Server is running' });
});

// ==================== AUTHENTICATION ROUTES ====================

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  db.get(
    'SELECT id, name, email, subscriptionPlan FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!row) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Update last login
      db.run('UPDATE users SET lastLogin = ? WHERE id = ?', [new Date().toISOString(), row.id]);

      res.json({
        success: true,
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          subscriptionPlan: row.subscriptionPlan,
        },
      });
    }
  );
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match' });
    return;
  }

  // Check if email already exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (row) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Create new user
    const userId = uuidv4();
    db.run(
      `INSERT INTO users (id, name, email, password, subscriptionPlan, subscriptionExpiry, createdAt, lastLogin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        email,
        password,
        'free',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days trial
        new Date().toISOString(),
        new Date().toISOString(),
      ],
      (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to create user' });
          return;
        }

        // Create initial usage stats
        db.run(
          `INSERT INTO usage_stats (id, userId, todayUsage, weekUsage, monthUsage, uploadSpeed, downloadSpeed, averageSpeed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), userId, 0, 0, 0, 0, 0, 0]
        );

        res.status(201).json({
          success: true,
          user: {
            id: userId,
            name: name,
            email: email,
            subscriptionPlan: 'free',
          },
        });
      }
    );
  });
});

// Get user profile
app.get('/api/user/profile', (req, res) => {
  const userId = req.query.userId || DEFAULT_USER_ID;
  db.get(
    'SELECT id, name, email, subscriptionPlan, subscriptionExpiry, totalDataUsed, createdAt, lastLogin FROM users WHERE id = ?',
    [userId],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  );
});

// Get usage statistics
app.get('/api/usage/stats', (req, res) => {
  db.get(
    'SELECT * FROM usage_stats WHERE userId = ?',
    [DEFAULT_USER_ID],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else if (row) {
        res.json({
          currentSpeed: {
            upload: row.uploadSpeed,
            download: row.downloadSpeed,
          },
          todayUsage: row.todayUsage,
          weekUsage: row.weekUsage,
          monthUsage: row.monthUsage,
          averageSpeed: row.averageSpeed,
        });
      } else {
        res.status(404).json({ error: 'Stats not found' });
      }
    }
  );
});

// Start VPN connection
app.post('/api/vpn/start', (req, res) => {
  const { serverId } = req.body;
  const connectionId = uuidv4();
  const startTime = new Date().toISOString();

  db.run(
    `INSERT INTO connections (id, userId, serverId, startTime, status)
     VALUES (?, ?, ?, ?, 'connected')`,
    [connectionId, DEFAULT_USER_ID, serverId || 'server1', startTime],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Failed to start VPN' });
      } else {
        res.json({
          connectionId,
          status: 'connected',
          startTime,
          message: 'VPN connection started',
        });
      }
    }
  );
});

// Stop VPN connection
app.post('/api/vpn/stop', (req, res) => {
  const { connectionId } = req.body;
  const endTime = new Date().toISOString();

  db.get(
    'SELECT * FROM connections WHERE id = ? AND userId = ?',
    [connectionId, DEFAULT_USER_ID],
    (err, connection) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!connection) {
        res.status(404).json({ error: 'Connection not found' });
        return;
      }

      const startTime = new Date(connection.startTime);
      const endTimeDate = new Date(endTime);
      const duration = Math.floor((endTimeDate - startTime) / 1000);
      const dataUsed = Math.random() * 500 + 100; // Random data usage

      // Update connection with end time and duration
      db.run(
        `UPDATE connections SET endTime = ?, duration = ?, dataUsed = ?, status = 'disconnected'
         WHERE id = ?`,
        [endTime, duration, dataUsed, connectionId],
        (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to stop VPN' });
            return;
          }

          // Add to connection logs
          db.run(
            `INSERT INTO connection_logs (id, userId, timestamp, serverLocation, ipAddress, dataUsed, duration, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'disconnected')`,
            [
              uuidv4(),
              DEFAULT_USER_ID,
              startTime.toISOString(),
              'New York, USA',
              `104.21.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
              dataUsed,
              duration,
            ]
          );

          // Update total data used
          db.run(
            `UPDATE users SET totalDataUsed = totalDataUsed + ? WHERE id = ?`,
            [dataUsed, DEFAULT_USER_ID]
          );

          res.json({
            status: 'disconnected',
            endTime,
            duration,
            dataUsed,
            message: 'VPN connection stopped',
          });
        }
      );
    }
  );
});

// Get current connection status
app.get('/api/vpn/status', (req, res) => {
  db.get(
    `SELECT * FROM connections WHERE userId = ? AND status = 'connected' ORDER BY startTime DESC LIMIT 1`,
    [DEFAULT_USER_ID],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else if (row) {
        const startTime = new Date(row.startTime);
        const now = new Date();
        const connectionTime = Math.floor((now - startTime) / 1000);
        res.json({
          isConnected: true,
          connectionId: row.id,
          serverId: row.serverId,
          connectionTime,
          dataUsed: row.dataUsed || 0,
        });
      } else {
        res.json({ isConnected: false });
      }
    }
  );
});

// Get connection logs
app.get('/api/connections/logs', (req, res) => {
  db.all(
    `SELECT * FROM connection_logs WHERE userId = ? ORDER BY timestamp DESC LIMIT 50`,
    [DEFAULT_USER_ID],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(rows || []);
      }
    }
  );
});

// Get available servers
app.get('/api/servers', (req, res) => {
  const servers = [
    {
      id: 'server1',
      name: 'NY-01',
      location: 'New York, USA',
      country: 'United States',
      ip: '104.21.45.67',
      load: Math.floor(Math.random() * 60 + 20),
      protocol: 'OpenVPN',
      ping: Math.floor(Math.random() * 30 + 10),
      status: 'online',
    },
    {
      id: 'server2',
      name: 'LON-01',
      location: 'London, UK',
      country: 'United Kingdom',
      ip: '93.184.216.34',
      load: Math.floor(Math.random() * 60 + 20),
      protocol: 'WireGuard',
      ping: Math.floor(Math.random() * 40 + 20),
      status: 'online',
    },
    {
      id: 'server3',
      name: 'TYO-01',
      location: 'Tokyo, Japan',
      country: 'Japan',
      ip: '203.0.113.45',
      load: Math.floor(Math.random() * 60 + 20),
      protocol: 'OpenVPN',
      ping: Math.floor(Math.random() * 100 + 70),
      status: 'online',
    },
    {
      id: 'server4',
      name: 'SYD-01',
      location: 'Sydney, Australia',
      country: 'Australia',
      ip: '192.0.2.123',
      load: Math.floor(Math.random() * 60 + 20),
      protocol: 'WireGuard',
      ping: Math.floor(Math.random() * 180 + 140),
      status: 'online',
    },
    {
      id: 'server5',
      name: 'TOR-01',
      location: 'Toronto, Canada',
      country: 'Canada',
      ip: '198.51.100.56',
      load: Math.floor(Math.random() * 60 + 20),
      protocol: 'OpenVPN',
      ping: Math.floor(Math.random() * 50 + 30),
      status: 'online',
    },
    {
      id: 'server6',
      name: 'AMS-01',
      location: 'Amsterdam, Netherlands',
      country: 'Netherlands',
      ip: '198.19.255.1',
      load: Math.floor(Math.random() * 60 + 20),
      protocol: 'WireGuard',
      ping: Math.floor(Math.random() * 40 + 20),
      status: 'online',
    },
  ];
  res.json(servers);
});

// Change password
app.post('/api/user/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: 'Missing password fields' });
    return;
  }

  db.get('SELECT password FROM users WHERE id = ?', [DEFAULT_USER_ID], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (!row || row.password !== oldPassword) {
      res.status(401).json({ error: 'Old password is incorrect' });
      return;
    }

    db.run(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, DEFAULT_USER_ID],
      (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to change password' });
        } else {
          res.json({ message: 'Password changed successfully' });
        }
      }
    );
  });
});

// Get usage trends (hourly data)
app.get('/api/usage/trends', (req, res) => {
  const trends = [
    { hour: '00:00', upload: 50, download: 120, dataUsed: 2.5 },
    { hour: '04:00', upload: 35, download: 85, dataUsed: 1.8 },
    { hour: '08:00', upload: 120, download: 250, dataUsed: 5.2 },
    { hour: '12:00', upload: 95, download: 180, dataUsed: 4.1 },
    { hour: '16:00', upload: 140, download: 320, dataUsed: 6.8 },
    { hour: '20:00', upload: 160, download: 380, dataUsed: 7.5 },
    { hour: '23:00', upload: 75, download: 150, dataUsed: 3.2 },
  ];
  res.json(trends);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ VPN Backend Server running on http://localhost:${PORT}`);
  console.log(`✓ Database: ${dbPath}`);
  console.log(`✓ CORS enabled`);
  console.log('\nAvailable endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/user/profile');
  console.log('  GET  /api/usage/stats');
  console.log('  POST /api/vpn/start');
  console.log('  POST /api/vpn/stop');
  console.log('  GET  /api/vpn/status');
  console.log('  GET  /api/connections/logs');
  console.log('  GET  /api/servers');
  console.log('  GET  /api/usage/trends');
  console.log('  POST /api/user/change-password\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Database close error:', err);
    } else {
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  });
});

module.exports = app;
