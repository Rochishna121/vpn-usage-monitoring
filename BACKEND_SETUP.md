# VPN Monitor - Backend Installation & Setup Guide

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Port 5000 (backend) and Port 3000 (frontend) must be available

## 🚀 Quick Start

### Step 1: Install Dependencies

All dependencies are already installed. To verify:

```bash
npm list sqlite3 uuid cors body-parser express
```

### Step 2: Start the Backend Server

In a **new terminal/PowerShell window**:

```bash
npm run backend
```

You should see output like:
```
✓ VPN Backend Server running on http://localhost:5000
✓ Database: C:\Users\pilla\OneDrive\Desktop\bool\vpn_monitor.db
✓ CORS enabled

Available endpoints:
  GET  /api/health
  GET  /api/user/profile
  GET  /api/usage/stats
  POST /api/vpn/start
  POST /api/vpn/stop
  GET  /api/vpn/status
  GET  /api/connections/logs
  GET  /api/servers
  GET  /api/usage/trends
  POST /api/user/change-password
```

### Step 3: Start the Frontend (In original terminal)

```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

### Step 4: Access the Dashboard

Open your browser and go to:
```
http://localhost:3000/dashboard
```

## 📦 Running Both Together

To run both backend and frontend in one command:

```bash
npm run dev:all
```

(Requires `concurrently` - install with: `npm install concurrently --save-dev`)

## 🗄️ Database

The SQLite database is automatically created at:
```
C:\Users\pilla\OneDrive\Desktop\bool\vpn_monitor.db
```

**Default User Credentials:**
- Email: `john@example.com`
- Password: `password123`
- Plan: Premium (expires in 90 days)

## 🔧 Backend API Endpoints

### User Management
- `GET /api/user/profile` - Get user profile
- `POST /api/user/change-password` - Change password

### VPN Connection
- `POST /api/vpn/start` - Start VPN connection
- `POST /api/vpn/stop` - Stop VPN connection
- `GET /api/vpn/status` - Get current connection status

### Usage & Analytics
- `GET /api/usage/stats` - Get usage statistics
- `GET /api/usage/trends` - Get hourly usage trends
- `GET /api/connections/logs` - Get connection history

### Server Management
- `GET /api/servers` - Get available servers
- `GET /api/health` - Health check

## 📊 Features Now Working

✅ **Start/Stop VPN** - Backend controls connections, stores data
✅ **Live Timer** - Connection time tracked in database
✅ **Data Transfer** - Recorded per session
✅ **Connection Logs** - All connections stored in database
✅ **Usage Statistics** - Daily, weekly, monthly tracking
✅ **Multiple Servers** - Select from 6 global locations
✅ **User Profile** - Subscription and account info
✅ **Charts & Graphs** - Historical data visualization

## 🧹 Troubleshooting

### Backend won't start
1. Check if port 5000 is already in use:
   ```
   netstat -ano | Select-String "5000"
   ```
2. Kill the process using port 5000 if needed

### Frontend can't connect to backend
1. Ensure backend is running on http://localhost:5000
2. Check `.env.local` has correct API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Check browser console for CORS errors

### Database errors
1. Delete `vpn_monitor.db` to reset database
2. Restart backend server

## 📝 Project Structure

```
project/
├── server.js                 # Backend Express server
├── src/
│   ├── app/
│   │   ├── dashboard/       # Dashboard page
│   │   ├── login/           # Login page
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── LiveVPNStatus.tsx    # VPN controls (now using API)
│   │   ├── UsageOverview.tsx    # Charts component
│   │   ├── ConnectionLogs.tsx   # Logs table
│   │   ├── ServerSelection.tsx  # Server picker
│   │   ├── AccountProfile.tsx   # Account settings
│   │   └── Navbar.tsx           # Navigation
│   ├── services/
│   │   └── vpnApi.ts        # API client for backend
│   └── lib/
│       └── demoData.ts      # Demo data (fallback)
├── vpn_monitor.db           # SQLite database (auto-created)
└── .env.local               # Environment config

```

## 🎯 Next Steps

1. ✅ Backend is running - stores all data in SQLite
2. ✅ Frontend is connected - uses API endpoints
3. ✅ All functions working - Start/Stop, timers, logs, etc.

You can now:
- Click "Start VPN" to establish a connection (stored in DB)
- Watch the timer count up in real-time
- See data transferred accumulate
- Click "Stop VPN" to end the session (saved to logs)
- View all past connections in Connection Logs tab
- See live charts with real data

## 🔐 Security Notes

For production:
1. Add authentication/JWT tokens
2. Use environment variables for sensitive data
3. Validate all API inputs
4. Use HTTPS for API calls
5. Implement rate limiting
6. Add database encryption

---

**Backend Status:** Running on port 5000 ✓
**Frontend Status:** Running on port 3000 ✓
**Database:** SQLite (vpn_monitor.db) ✓
