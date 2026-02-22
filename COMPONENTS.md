# Component Reference Guide

This document provides detailed information about each component in the VPN Monitor application.

## Authentication Components

### 🔐 AuthContext (`src/contexts/AuthContext.tsx`)

**Purpose:** Manages user authentication state throughout the application

**Key Features:**
- User login/logout
- JWT token management
- Auto-refresh token handling
- Route protection

**Exports:**
- `AuthProvider` - Context provider (wrap app with this)
- `useAuth()` - Hook to access auth context

**Usage:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
};
```

**State:**
- `user: User | null` - Current logged-in user
- `isAuthenticated: boolean` - Is user logged in
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

---

## Page Components

### 📱 Login Page (`src/app/login/page.tsx`)

**Purpose:** User authentication interface

**Features:**
- Email/password input
- Form validation
- Error handling
- Loading states
- Auto-redirect to dashboard if already logged in

**Route:** `/login`

**Key Elements:**
- Email input field
- Password input field
- Sign in button
- Error alert display

---

### 📊 Dashboard Page (`src/app/dashboard/page.tsx`)

**Purpose:** Main application dashboard with tab navigation

**Features:**
- Tab-based navigation
- Route protection
- Component switching
- Loading states

**Route:** `/dashboard`

**Tabs:**
1. Overview
2. Connection Logs
3. Servers
4. Account

---

### 🏠 Home Page (`src/app/page.tsx`)

**Purpose:** Redirect users based on auth status

**Behavior:**
- Authenticated → Redirect to `/dashboard`
- Unauthenticated → Redirect to `/login`

**Route:** `/`

---

## UI Components

### 🧭 Navbar (`src/components/Navbar.tsx`)

**Purpose:** Application navigation and user menu

**Props:**
```typescript
interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

**Features:**
- Tab navigation (overview, logs, servers, account)
- User info display
- Logout button
- Mobile responsive menu
- Icons for each tab

**Sub-elements:**
- Tab buttons
- User profile section
- Logout button
- Mobile hamburger menu

---

### 📈 UsageOverview (`src/components/UsageOverview.tsx`)

**Purpose:** Display real-time VPN usage statistics

**Features:**
- Fetches usage data from API
- Auto-refresh every 30 seconds
- Error handling
- Loading state

**API Calls:**
- `GET /usage/stats` - Fetch statistics

**Displays:**
- Upload speed
- Download speed
- Today's usage
- Weekly usage
- Monthly usage
- Average speed

**Data Types:**
```typescript
interface UsageStats {
  currentSpeed: { upload: number; download: number };
  todayUsage: number;
  weekUsage: number;
  monthUsage: number;
  averageSpeed: number;
}
```

---

### 📋 ConnectionLogs (`src/components/ConnectionLogs.tsx`)

**Purpose:** Display connection history in tabular format

**Features:**
- Fetches connection logs from API
- Auto-refresh every 60 seconds
- Sortable table
- Status indicators
- Formatted durations and timestamps

**API Calls:**
- `GET /connections/logs?limit=50` - Fetch logs

**Table Columns:**
- Status (icon + badge)
- Server Location
- IP Address
- Duration
- Data Used
- Time (relative)

**Status Types:**
- Connected (green, CheckCircle)
- Disconnected (gray, Clock)
- Failed (red, XCircle)

**Data Types:**
```typescript
interface ConnectionLog {
  id: string;
  timestamp: string;
  serverLocation: string;
  ipAddress: string;
  dataUsed: number;
  duration: number;
  status: 'connected' | 'disconnected' | 'failed';
}
```

---

### 🌍 ServerSelection (`src/components/ServerSelection.tsx`)

**Purpose:** Display and select VPN servers

**Features:**
- Fetches available servers
- Auto-refresh every 60 seconds
- Server selection
- Load visualization
- Ping display
- Responsive grid layout

**API Calls:**
- `GET /servers/available` - Fetch servers

**Server Card Displays:**
- Server name
- Location
- Status badge
- Load percentage (with color coding)
- Ping in milliseconds
- IP address
- Protocol
- Select button

**Load Colors:**
- Green (< 40%) - Low load
- Yellow (40-70%) - Moderate load  
- Red (> 70%) - High load

**Data Types:**
```typescript
interface VPNServer {
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
```

---

### 👤 AccountProfile (`src/components/AccountProfile.tsx`)

**Purpose:** User account settings and management

**Features:**
- Fetch user profile
- View subscription details
- Change password
- Delete account
- Error/success messages

**API Calls:**
- `GET /account/profile` - Fetch profile
- `PUT /account/profile` - Update profile
- `POST /account/change-password` - Update password
- `POST /account/delete` - Delete account

**Sections:**
1. Profile Information
   - Name
   - Email
   - Account created date
   - Last login

2. Subscription
   - Plan type
   - Status
   - Expiry date
   - Total data used

3. Security
   - Change password form
   - Current password
   - New password
   - Confirm password

4. Danger Zone
   - Delete account warning
   - Confirmation password

**Data Types:**
```typescript
interface AccountProfile {
  id: string;
  email: string;
  name: string;
  subscriptionPlan: 'free' | 'premium' | 'enterprise';
  subscriptionExpiry: string;
  createdAt: string;
  lastLogin: string;
  totalDataUsed: number;
}
```

---

## Service Layer

### 🔌 API Client (`src/services/api.ts`)

**Purpose:** Centralized API communication with interceptors

**Key Features:**
- Request/response interceptors
- JWT token management
- Error handling
- Type-safe API methods

**Authentication:**
- Automatically adds JWT token to requests
- Handles 401 errors (expired tokens)
- Auto-logout on authorization failure

**Base URL:**
```typescript
baseURL = process.env.NEXT_PUBLIC_API_URL
```

**Available Methods:**

**Authentication:**
- `login(credentials)` - POST /auth/login
- `logout()` - POST /auth/logout
- `refreshToken()` - POST /auth/refresh

**Usage:**
- `getUsageStats()` - GET /usage/stats
- `getUsageHistory(range)` - GET /usage/history
- `getCurrentUsage()` - GET /usage/current

**Connections:**
- `getConnectionLogs(limit)` - GET /connections/logs
- `getConnectionStats()` - GET /connections/stats

**Servers:**
- `getAvailableServers()` - GET /servers/available
- `getServerLocations()` - GET /servers/locations
- `getRecommendedServer()` - GET /servers/recommended

**Account:**
- `getAccountProfile()` - GET /account/profile
- `updateProfile(data)` - PUT /account/profile
- `changePassword(old, new)` - POST /account/change-password
- `deleteAccount(password)` - POST /account/delete

---

## Type Definitions

### 📝 Types (`src/types/index.ts`)

All TypeScript interfaces for the application:

**Authentication:**
- `LoginCredentials`
- `AuthResponse`
- `User`

**Usage:**
- `UsageData`
- `UsageStats`

**Connections:**
- `ConnectionLog`

**Servers:**
- `VPNServer`

**Account:**
- `AccountProfile`

**API:**
- `ApiResponse<T>`

**Charts:**
- `ChartDataPoint`
- `LineChartData`

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│              User Interface (Pages)                  │
│   Login / Dashboard (Overview, Logs, Servers, Acc) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│          Component Layer                            │
│  Navbar, UsageOverview, ConnectionLogs, etc.       │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│         Context Layer (State Management)            │
│              AuthContext (useAuth)                  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│         Service Layer (API Integration)             │
│              APIClient (api.ts)                     │
│        (Interceptors, Error Handling)               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│           Google Cloud Backend API                  │
│     (Authentication, Usage, Connections, etc.)     │
└─────────────────────────────────────────────────────┘
```

---

## Component Dependency Tree

```
RootLayout (layout.tsx)
  └─ AuthProvider
      ├─ page.tsx (Root redirect)
      ├─ login/page.tsx (Login)
      │   └─ useAuth hook
      │
      └─ dashboard/page.tsx (Dashboard)
          ├─ Navbar
          │   └─ useAuth hook
          │
          └─ Tab routing to:
              ├─ UsageOverview
              │   └─ apiClient.getUsageStats()
              │
              ├─ ConnectionLogs
              │   └─ apiClient.getConnectionLogs()
              │
              ├─ ServerSelection
              │   └─ apiClient.getAvailableServers()
              │
              └─ AccountProfile
                  ├─ apiClient.getAccountProfile()
                  ├─ apiClient.changePassword()
                  └─ apiClient.deleteAccount()
```

---

## Hook Usage Guide

### useAuth() Hook

```tsx
const {
  user,              // User object or null
  isAuthenticated,   // Boolean
  isLoading,         // Boolean
  login,             // (credentials) => Promise
  logout,            // () => Promise
  error,             // Error message or null
  clearError         // () => void
} = useAuth();
```

### useState Hook (Component-level)

Used in components for managing local state:
- `isLoading` - API call state
- `error` - Component error state
- `data` - Component data

---

## Error Handling Strategy

### At Component Level
1. Try/catch blocks for API calls
2. Error state management
3. User-friendly error messages
4. Retry mechanisms

### At API Level
1. Request/response interceptors
2. Automatic 401 logout
3. Error logging
4. Network timeout handling

### At Auth Level
1. Token expiration handling
2. Token refresh mechanism
3. Session management

---

## Performance Optimizations

### Caching Strategy
- Usage stats: 30-second refresh
- Connection logs: 60-second refresh
- Servers: 60-second refresh
- Profile: On-demand only

### Code Splitting
- Page-based code splitting
- Lazy loading of routes
- Component-level optimization

### Image & Asset Optimization
- Next.js image optimization
- CSS minification
- JavaScript minification
- Static generation where possible

---

## Extending the Application

### Adding a New Feature

1. **Create Type Definition**
   ```typescript
   // src/types/index.ts
   interface NewFeature {
     id: string;
     name: string;
     // ...
   }
   ```

2. **Add API Methods**
   ```typescript
   // src/services/api.ts
   async getNewFeature(): Promise<NewFeature[]> {
     const response = await this.client.get<ApiResponse<NewFeature[]>>(
       '/new-feature'
     );
     return response.data.data;
   }
   ```

3. **Create Component**
   ```typescript
   // src/components/NewFeature.tsx
   export const NewFeature: React.FC = () => {
     const [data, setData] = useState<NewFeature[]>([]);
     // Component logic
   };
   ```

4. **Add Tab in Dashboard**
   ```typescript
   // src/app/dashboard/page.tsx
   {activeTab === 'newfeature' && <NewFeature />}
   ```

---

## Testing Components

### Unit Testing (Add with Jest/Vitest)
- Test individual components
- Mock API responses
- Test user interactions
- Verify error states

### Integration Testing
- Test component interactions
- Test API integration
- Test auth flow
- Test navigation

---

## Common Patterns

### Data Fetching Pattern
```tsx
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      setIsLoading(true);
      const result = await apiClient.getMethod();
      setData(result);
    } catch (err) {
      setError('Error message');
    } finally {
      setIsLoading(false);
    }
  };
  fetch();
}, []);
```

### Auth-Protected Component
```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return <YourComponent />;
}
```

---

For more information, see:
- [README.md](./README.md) - Full documentation
- [API_INTEGRATION.md](./API_INTEGRATION.md) - Backend API details
- [QUICKSTART.md](./QUICKSTART.md) - Getting started guide
