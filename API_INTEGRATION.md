# API Integration Guide

This document describes how to integrate your Google Cloud VPN backend with this frontend application.

## Overview

The frontend uses Axios to communicate with your backend API. All requests include JWT authentication tokens in the Authorization header.

## Base Configuration

**File:** `src/services/api.ts`

The API client is configured to use:
```typescript
baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://34.98.5.27:8080/api'
```

**Set your API URL in `.env.local`:**
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

## Request/Response Format

### Authentication Requests

All authenticated requests include:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Response Format

All API responses must follow this format:

```typescript
{
  success: boolean,
  data?: T,           // Your data
  error?: string,     // Error message if success=false
  message?: string    // Optional message
}
```

### Example Success Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Example Error Response
```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

## API Endpoints

Your backend must implement the following endpoints:

### 1. Authentication Endpoints

#### POST /auth/login
**Purpose:** Authenticate user and return JWT token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Errors:** 401 (Invalid credentials)

---

#### POST /auth/logout
**Purpose:** Logout user (optional backend cleanup)

**Request:** (Requires Bearer token)
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST /auth/refresh
**Purpose:** Refresh expired JWT token

**Request:** (Include current token)
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

---

### 2. Usage Endpoints

#### GET /usage/stats
**Purpose:** Get current usage statistics

**Request:**
```
GET /api/usage/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentSpeed": {
      "upload": 5242880,      // bytes per second (5 MB/s)
      "download": 10485760    // bytes per second (10 MB/s)
    },
    "todayUsage": 5.32,        // GB
    "weekUsage": 35.67,        // GB
    "monthUsage": 142.89,      // GB
    "averageSpeed": 45.2       // Mbps
  }
}
```

---

#### GET /usage/history?range=daily
**Purpose:** Get historical usage data

**Query Parameters:**
- `range`: `hourly`, `daily` (default), `weekly`, or `monthly`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2024-02-22T10:00:00Z",
      "uploadSpeed": 2097152,      // bytes per second
      "downloadSpeed": 4194304,    // bytes per second
      "totalDataUsed": 1.5,        // GB
      "isConnected": true
    },
    ...
  ]
}
```

---

#### GET /usage/current
**Purpose:** Get real-time current usage

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-02-22T14:35:22Z",
    "uploadSpeed": 5242880,
    "downloadSpeed": 10485760,
    "totalDataUsed": 2.15,
    "isConnected": true
  }
}
```

---

### 3. Connection Endpoints

#### GET /connections/logs?limit=50
**Purpose:** Get connection history logs

**Query Parameters:**
- `limit`: Number of logs to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conn123",
      "timestamp": "2024-02-22T10:00:00Z",
      "serverLocation": "New York",
      "ipAddress": "203.0.113.45",
      "dataUsed": 512.5,       // MB
      "duration": 3600,        // seconds
      "status": "connected"    // or "disconnected" or "failed"
    },
    ...
  ]
}
```

---

#### GET /connections/stats
**Purpose:** Get connection statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalConnections": 256,
    "successRate": 98.5,       // percentage
    "averageDuration": 1800    // seconds
  }
}
```

---

### 4. Server Endpoints

#### GET /servers/available
**Purpose:** Get list of available VPN servers

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "server123",
      "name": "NY-01",
      "location": "New York, USA",
      "country": "United States",
      "ip": "104.21.45.67",
      "load": 45,              // percentage 0-100
      "protocol": "OpenVPN",
      "ping": 25,              // milliseconds
      "status": "online"       // or "offline"
    },
    ...
  ]
}
```

---

#### GET /servers/locations
**Purpose:** Get list of available server locations

**Response:**
```json
{
  "success": true,
  "data": [
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Sydney, Australia",
    ...
  ]
}
```

---

#### GET /servers/recommended
**Purpose:** Get recommended server based on user's location/load

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "server123",
    "name": "NY-01",
    "location": "New York, USA",
    "country": "United States",
    "ip": "104.21.45.67",
    "load": 25,
    "protocol": "OpenVPN",
    "ping": 20,
    "status": "online"
  }
}
```

---

### 5. Account Endpoints

#### GET /account/profile
**Purpose:** Get current user's account profile

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "john@example.com",
    "name": "John Doe",
    "subscriptionPlan": "premium",     // "free", "premium", "enterprise"
    "subscriptionExpiry": "2025-02-22T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-02-22T14:30:00Z",
    "totalDataUsed": 542.15            // GB
  }
}
```

---

#### PUT /account/profile
**Purpose:** Update user profile (partial update ok)

**Request:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "john.smith@example.com",
    "name": "John Smith",
    ...
  }
}
```

---

#### POST /account/change-password
**Purpose:** Change user password

**Request:**
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**
- 401: Old password incorrect
- 400: New password doesn't meet requirements

---

#### POST /account/delete
**Purpose:** Delete user account (permanent)

**Request:**
```json
{
  "password": "userPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Errors:**
- 401: Password incorrect
- 409: Confirm deletion required

---

## Error Handling

### HTTP Status Codes

- **200**: Successful request
- **400**: Bad request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **500**: Server error

### Error Response Format

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Email is already in use"
}
```

---

## CORS Configuration

Your backend must allow requests from your frontend domain:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```

For production, replace `http://localhost:3000` with your actual frontend domain.

---

## JWT Token Format

Tokens should be:
- Valid JWT format
- Include user ID in payload
- Have an expiration time
- Refreshable (optional but recommended)

**Example payload:**
```json
{
  "sub": "user123",
  "email": "john@example.com",
  "iat": 1645466400,
  "exp": 1645552800
}
```

---

## Rate Limiting (Optional)

Consider implementing:
- Rate limiting per user
- Request throttling
- DDoS protection
- IP whitelisting

---

## Data Types Reference

### Speed Values
Speeds should be in **bytes per second**:
- 1 KB/s = 1024 B/s
- 1 MB/s = 1048576 B/s
- 1 GB/s = 1073741824 B/s

### Data Usage
Data amounts should be in **gigabytes** (GB):
- 1 GB = 1024 MB

### Timestamps
All timestamps must follow **ISO 8601 format**:
- Format: `2024-02-22T14:35:22Z`
- Timezone: UTC (Z)

### Duration
Duration values should be in **seconds**

---

## Testing

You can test your endpoints using curl:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get usage (requires token)
curl -X GET http://localhost:8080/api/usage/stats \
  -H "Authorization: Bearer <token>"

# Get servers
curl -X GET http://localhost:8080/api/servers/available
```

---

## Troubleshooting

### Frontend shows "Failed to fetch" errors

1. Check API URL in `.env.local`
2. Verify backend is running
3. Check CORS headers are set correctly
4. Check browser console for detailed errors

### Login returns 401

1. Verify credentials are correct
2. Check JWT generation on backend
3. Verify response includes `token` field

### Data not showing in dashboard

1. Check API responses match the format above
2. Verify all required fields are present
3. Check timestamps are in ISO 8601 format
4. Check numeric values have correct units

---

## Performance Tips

1. **Cache responses**: Frontend caches data for 30-60 seconds
2. **Paginate results**: Limit results in `/connections/logs`
3. **Compress responses**: Enable gzip compression
4. **Use CDN**: Serve static assets from CDN
5. **Optimize queries**: Index database fields

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Validate all inputs on backend
- [ ] Use strong JWT secrets
- [ ] Implement rate limiting
- [ ] Hash passwords properly
- [ ] Use secure headers (CORS, CSP, etc.)
- [ ] Log all authentication attempts
- [ ] Monitor for suspicious activity

---

For more details, see the main [README.md](./README.md)
