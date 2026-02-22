# Mock Backend Server 🧪

This is a demo mock backend server for testing the VPN Monitor frontend without a real Google Cloud backend.

## Features

✅ **All Required Endpoints** - Implements all API endpoints the frontend expects
✅ **Mock Data** - Generates realistic random data for testing
✅ **JWT Authentication** - Accepts any credentials for demo purposes
✅ **CORS Enabled** - Works seamlessly with the frontend
✅ **No Database** - Runs in-memory, no setup needed

## Quick Start

### Option 1: Run Backend Only (In Separate Terminal)

```bash
npm run backend
```

The mock backend will start on `http://localhost:8080`

### Option 2: Run Frontend Only (In Separate Terminal)

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### Option 3: Run Both Together (Windows)

Double-click: **start-all.bat**

This launches both the mock backend and frontend in separate terminal windows.

### Option 4: Run Backend & Frontend in Same Terminal (Linux/Mac)

```bash
npm run dev:full
```

(Requires `concurrently` - install with: `npm install --save-dev concurrently`)

## API Endpoints

All endpoints are available at: `http://localhost:8080/api`

### Authentication
- `POST /auth/login` - Login (accepts any email/password)
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token

### Usage
- `GET /usage/stats` - Get usage statistics
- `GET /usage/history?range=daily` - Get usage history
- `GET /usage/current` - Get current usage

### Connections
- `GET /connections/logs?limit=50` - Get connection logs
- `GET /connections/stats` - Get connection statistics

### Servers
- `GET /servers/available` - Get available servers
- `GET /servers/locations` - Get server locations
- `GET /servers/recommended` - Get recommended server

### Account
- `GET /account/profile` - Get user profile
- `PUT /account/profile` - Update profile
- `POST /account/change-password` - Change password
- `POST /account/delete` - Delete account

### Health Check
- `GET /api/health` - Check if server is running

## Login Credentials

**Any email and password combination works!**

Try:
- Email: `test@example.com`
- Password: `password`

Or:
- Email: `demo@demo.com`
- Password: `anything`

## How It Works

The mock backend:
1. Accepts HTTP requests on port 8080
2. Validates JWT tokens (simple check - any Bearer token works)
3. Returns realistic mock data
4. Generates random values for speeds, loads, IPs, locations, etc.
5. No data persistence (resets on restart)

## Switching to Real Backend

When your real Google Cloud backend is ready:

1. Update `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://your-real-api.com/api
   ```

2. Stop the mock backend

3. Restart the frontend

## Troubleshooting

### "Port 8080 already in use"
The port is already taken. Either:
- Stop whatever is using port 8080
- Or change the mock backend port in `mock-backend.js` (line: `const PORT = ...`)

### "Cannot find module 'express'"
Run: `npm install express cors body-parser`

### Frontend can't reach backend
- Make sure both are running
- Check `.env.local` has correct API URL
- Verify frontend is on 3000, backend is on 8080

## Data Realism

The mock backend generates:
- **Speeds**: Random values simulating realistic network speeds (1-10 MB/s download, 1-5 MB/s upload)
- **Data Usage**: Random amounts in GB and MB
- **Load**: Server load 0-100%
- **Ping**: Realistic latency based on location (20-200ms)
- **Timestamps**: ISO 8601 format
- **IPs**: Random valid-looking IP addresses
- **Locations**: Real VPN server locations

## Limitations

This mock backend:
- ❌ Doesn't persist data (all data resets on restart)
- ❌ Doesn't validate user credentials (any email/password works)
- ❌ Doesn't store passwords or user info
- ❌ Returns random data each call (not sequential)
- ❌ Is for development/testing only

## For Production

Replace this with your real Google Cloud backend API before deploying!

## Testing the Backend

### Test with curl

```bash
# Health check
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# Get usage (need token)
curl -X GET http://localhost:8080/api/usage/stats \
  -H "Authorization: Bearer any-token"
```

### Test with Frontend

1. Start mock backend: `npm run backend`
2. Start frontend: `npm run dev`
3. Open http://localhost:3000
4. Login with any email/password
5. Browse all features!

## Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (Next.js on 3000)           │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
               ▼
┌─────────────────────────────────────────┐
│  Mock Backend (Express on 8080)        │
│  - Handles auth                         │
│  - Returns mock data                    │
│  - Simulates real backend               │
└─────────────────────────────────────────┘
```

## Next Steps

1. ✅ Develop and test frontend features
2. ✅ Build your real Google Cloud backend
3. ✅ Test that real backend returns same data format
4. ✅ Update `.env.local` to point to real backend
5. ✅ Remove this mock backend from production

## Notes for Backend Development

When building your real backend, make sure it:
- Returns responses in the exact format this mock uses
- Sets proper CORS headers
- Validates JWT tokens correctly
- Returns data with correct types and units
- Handles 401 errors properly

See [API_INTEGRATION.md](../API_INTEGRATION.md) for full API specification!

---

Happy testing! 🎉
