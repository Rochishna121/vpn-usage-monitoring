# VPN Monitor - Quick Start Guide

## ✅ Project Created Successfully!

Your Vue VPN monitoring dashboard frontend has been created and is ready to use.

## 🚀 Quick Start

### 1. Configuration (IMPORTANT!)

Before running the application, you MUST configure your Google Cloud backend API URL:

**File: `.env.local`**
```
NEXT_PUBLIC_API_URL=http://34.98.5.27:8080/api
```

Replace `http://34.98.5.27:8080/api` with your actual Google Cloud VPN backend URL.

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 3. Access the Application

- If not logged in → Redirects to **Login Page** (`/login`)
- If logged in → Redirects to **Dashboard** (`/dashboard`)

## 🔑 Features Overview

### 📊 Dashboard Tabs

1. **Overview** - Real-time VPN usage statistics
   - Current upload/download speeds
   - Today's, weekly, and monthly data usage
   - Average connection speed

2. **Connection Logs** - Detailed connection history
   - Server location and IP address
   - Connection duration and data used
   - Connection status (connected/disconnected/failed)

3. **Servers** - Available VPN servers
   - Server load visualization
   - Ping latency
   - Server location and protocol
   - Select preferred servers

4. **Account** - Account management
   - Profile information
   - Subscription details
   - Change password
   - Delete account (danger zone)

## 🔐 Authentication

### Default Flow

1. User logs in with email/password
2. Backend validates credentials and returns JWT token
3. Token is stored locally
4. All API requests include the token
5. Token automatically refreshes when expired

### Test Login

Use credentials from your backend system. The form will accept:
- Email address (any valid email)
- Password (any password matching your backend)

## 📁 Project Structure

**Key Files & Folders:**

```
├── src/
│   ├── app/
│   │   ├── login/page.tsx         # Login page
│   │   ├── dashboard/page.tsx      # Main dashboard
│   │   ├── page.tsx               # Root redirect page
│   │   └── layout.tsx             # App layout with auth provider
│   │
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── UsageOverview.tsx       # Stats display
│   │   ├── ConnectionLogs.tsx      # Connection table
│   │   ├── ServerSelection.tsx     # Server browser
│   │   └── AccountProfile.tsx      # Account settings
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication context
│   │
│   ├── services/
│   │   └── api.ts                 # API client
│   │
│   └── types/
│       └── index.ts               # TypeScript definitions
│
├── .env.example                   # Environment template
├── .env.local                     # Your config (create from example)
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind CSS config
└── README.md                      # Full documentation
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌐 Backend API Integration

The frontend expects your backend to provide these endpoints:

**Base URL:** Whatever you set in `NEXT_PUBLIC_API_URL`

**Required Endpoints:**

```
POST   /auth/login              - Login user
POST   /auth/logout             - Logout user
POST   /auth/refresh            - Refresh token

GET    /usage/stats             - Get usage statistics
GET    /usage/history           - Get usage history
GET    /usage/current           - Get current usage

GET    /connections/logs        - Get connection logs
GET    /connections/stats       - Get stats

GET    /servers/available       - List servers
GET    /servers/locations       - Get locations
GET    /servers/recommended     - Get recommended server

GET    /account/profile         - Get profile
PUT    /account/profile         - Update profile
POST   /account/change-password - Change password
POST   /account/delete          - Delete account
```

## 🛠️ Customization

### Change API URL
Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=your_api_url_here
```

### Change Styling
- Edit `tailwind.config.ts` for color/theme changes
- Modify component styles in `src/components/`
- All components use Tailwind CSS classes

### Add New Features
1. Create component in `src/components/`
2. Define types in `src/types/index.ts`
3. Add API method in `src/services/api.ts`
4. Import and use in pages/components

## 🐛 Troubleshooting

### "Failed to fetch" errors

**Solution:** Check your API URL in `.env.local`
```bash
# Make sure backend is running and accessible
curl http://your-api-url/api/health
```

### Login not working

**Check:**
- API URL is correct in `.env.local`
- Backend login endpoint is working
- Credentials are valid
- Backend is returning JWT token

### Blank page or not loading

**Solution:**
1. Clear browser cache
2. Check browser console for errors
3. Verify all dependencies installed: `npm install`
4. Restart dev server: `npm run dev`

## 📦 Technologies

- **Next.js** 16.1.6 - React framework
- **React** 19.x - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Date-fns** - Date utilities
- **Lucide React** - Icons

## 🚀 Deployment

### To Vercel
```bash
npm install -g vercel
vercel
```

### To Other Platforms
```bash
npm run build        # Creates optimized build
# Upload .next folder to your server
```

**Important:** Set `NEXT_PUBLIC_API_URL` environment variable in your hosting platform!

## 📞 Support

**If having issues:**

1. Check browser console (F12 → Console)
2. Check Network tab for API calls
3. Verify backend is running
4. Check API responses match expected format
5. Review README.md for detailed documentation

## ✨ Next Steps

1. ✅ Update `.env.local` with your backend API URL
2. ✅ Test login functionality
3. ✅ Verify all dashboard features work
4. ✅ Customize styling/branding if needed
5. ✅ Deploy to production

---

**Happy monitoring! 🎉**

For detailed documentation, see [README.md](./README.md)
