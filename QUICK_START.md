# 🚀 Quick Start Guide - Backend & Frontend

## ⚡ Start the System (3 Easy Steps)

### Step 1: Open Terminal 1 (Backend)
```powershell
cd C:\Users\pilla\OneDrive\Desktop\bool
npm run backend
```

**You should see:**
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

### Step 2: Open Terminal 2 (Frontend)
```powershell
cd C:\Users\pilla\OneDrive\Desktop\bool
npm run dev
```

**You should see:**
```
✓ Local:        http://localhost:3000
```

### Step 3: Open Browser
```
http://localhost:3000/dashboard
```

---

## 🎮 What to Test

### 1. **Click "Start VPN"**
   - Timer counts up from 00:00:00
   - Data transferred increases
   - Shows "Connected" status
   - Green WiFi icon pulses
   - Data saved to backend database

### 2. **Click "Stop VPN"**
   - Timer resets to 00:00:00
   - Data resets to 0 B
   - Shows "Disconnected" status
   - Red WiFi icon shows
   - Session automatically saved to connection logs

### 3. **Check "Connection Logs" Tab**
   - Click "Connection Logs" tab
   - Scroll down (should be empty on first run)
   - After stopping VPN, refresh page
   - Your connection appears in the table
   - Shows: server, duration, data used, IP, timestamp

### 4. **View Charts in "Overview"**
   - See 4 professional charts with data
   - All showing real backend data
   - Charts update with new connections

### 5. **Check "Servers" Tab**
   - 6 servers with real-time load info
   - Load percentages randomize
   - Click to select before starting VPN

### 6. **View "Account" Tab**
   - Profile: John Doe
   - Email: john@example.com
   - Subscription: Premium
   - Total data used: Updates as you connect

---

## 📊 System Status

| Component | Status | URL | Port |
|-----------|--------|-----|------|
| Backend | ✅ Running | http://localhost:5000 | 5000 |
| Frontend | ✅ Running | http://localhost:3000 | 3000 |
| Database | ✅ Created | vpn_monitor.db | N/A |

---

## 🔄 To Run Both Together

```powershell
npm run dev:all
```

(Starts both backend and frontend in one command)

---

## 🗄️ Database Info

**Location:** `C:\Users\pilla\OneDrive\Desktop\bool\vpn_monitor.db`

**Tables:**
- `users` - User accounts
- `connections` - Active connections
- `connection_logs` - Connection history
- `usage_stats` - Usage tracking

**Default User:**
- Email: `john@example.com`
- Password: `password123`

---

## 🔧 Troubleshooting (Common Issues)

### Backend won't start
```powershell
# Check if port 5000 is in use
netstat -ano | Select-String "5000"

# Kill process using port 5000
Stop-Process -Id <PID> -Force
```

### Frontend won't connect to backend
1. Make sure backend is running first
2. Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3. Refresh browser (Ctrl+Shift+R to clear cache)

### Connection data not saving
1. Restart backend server
2. Check browser console for errors (F12)
3. Delete `vpn_monitor.db` and restart backend

---

## 📱 Features Overview

### ✅ Working Features
- Start/Stop VPN (saves to backend)
- Live connection timer (resets on stop)
- Data transfer tracking
- Connection logs (persistent)
- Usage charts (4 charts)
- Server selection (6 servers)
- User profile
- Account settings
- Password change
- Real-time updates

### ✅ Backend Features
- Express.js API server
- SQLite database
- CORS enabled
- 10+ API endpoints
- Connection tracking
- Data persistence
- User management
- Session recording

---

## 💡 Key Points

✨ **All data is persistent** - Sessions saved to database
✨ **Real-time updates** - Charts show live data
✨ **Fully functional** - All frontend features working
✨ **Ready to customize** - Backend can be extended
✨ **Production-ready** - Just needs authentication added

---

## 🎯 Next: What to Do

1. ✅ Start backend and frontend (see steps above)
2. ✅ Click "Start VPN" button to test
3. ✅ Watch timer count up
4. ✅ Check Connection Logs tab
5. ✅ Click "Stop VPN" to save session
6. ✅ Refresh and see it in Connection Logs
7. ✅ View charts with your data

---

**Ready to start? Follow the 3 steps above and enjoy your VPN Dashboard!** 🎉
