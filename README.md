# VPN Monitor - Frontend Dashboard

A modern React/Next.js frontend dashboard for monitoring VPN usage and connection activity. This application provides real-time statistics, connection logs, server selection, and account management.

## Features

✨ **Real-time Usage Statistics**
- Monitor current upload/download speeds
- Track daily, weekly, and monthly data usage
- View average connection speeds

📋 **Connection Logs**
- View detailed connection history
- See server locations and IP addresses
- Track data usage per connection
- Connection status indicators

🌍 **Server Selection**
- Browse available VPN servers by location
- See real-time server load and ping
- Select preferred servers
- Visual server status indicators

👤 **Account Management**
- View subscription details
- Change password securely
- Monitor subscription expiry
- Delete account if needed

🔐 **JWT-based Authentication**
- Secure login/logout
- Token refresh mechanism
- Automatic session management
- Protected routes

## Prerequisites

- Node.js 18.17+ or later
- npm, yarn, pnpm, or bun package manager
- Connection to Google Cloud VPN backend API

## Installation

1. **Clone or download the project**
```bash
cd bool
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Environment Variables**

Copy `.env.example` to `.env.local` and update with your Google Cloud backend URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://34.98.5.27:8080/api
```

> Replace the IP/URL with your actual Google Cloud VPN backend API endpoint.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # Login page
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout with AuthProvider
├── components/            # Reusable React components
│   ├── Navbar.tsx        # Navigation bar
│   ├── UsageOverview.tsx  # Usage statistics
│   ├── ConnectionLogs.tsx # Connection history
│   ├── ServerSelection.tsx# VPN server browser
│   └── AccountProfile.tsx # Account settings
├── contexts/              # React Context API
│   └── AuthContext.tsx    # Authentication context
├── services/              # API integration
│   └── api.ts            # API client with interceptors
├── types/                 # TypeScript type definitions
│   └── index.ts          # All type definitions
└── lib/                   # Utility functions
```

## API Integration

The frontend communicates with your Google Cloud backend through the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token

### Usage
- `GET /usage/stats` - Get current usage statistics
- `GET /usage/history?range=daily` - Get usage history
- `GET /usage/current` - Get current real-time usage

### Connections
- `GET /connections/logs?limit=50` - Get connection logs
- `GET /connections/stats` - Get connection statistics

### Servers
- `GET /servers/available` - List available servers
- `GET /servers/locations` - Get available locations
- `GET /servers/recommended` - Get recommended server

### Account
- `GET /account/profile` - Get user profile
- `PUT /account/profile` - Update profile
- `POST /account/change-password` - Change password
- `POST /account/delete` - Delete account

## Authentication Flow

1. User logs in with credentials
2. Backend returns JWT token
3. Token is stored in localStorage
4. Each API request includes token in Authorization header
5. Token is automatically refreshed on expiry
6. Unauthorized requests redirect to login

## Technologies Used

- **Framework**: Next.js 16.x with React 19.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js and react-chartjs-2
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API

## Component Details

### Navbar
Navigation component with tab switching and user logout functionality.

### UsageOverview
Displays real-time usage statistics including speeds, data usage by period, and average speeds.

### ConnectionLogs
Table view of connection history with status indicators, duration, and data usage.

### ServerSelection
Grid of available VPN servers with load indicators, ping, and selection functionality.

### AccountProfile
User account settings including subscription details, password change, and account deletion.

## Environment Variables

```
NEXT_PUBLIC_API_URL=<your-google-cloud-api-url>
```

- Required: Yes
- Default: http://34.98.5.27:8080/api
- Description: URL of your Google Cloud VPN backend API

Note: `NEXT_PUBLIC_` prefix makes the variable accessible in the browser.

## Styling

The application uses Tailwind CSS for styling with a blue color scheme. All components are responsive and mobile-friendly.

### Color Scheme
- Primary: Blue (Blue-600)
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Gray

## Error Handling

- Network errors display helpful messages
- API errors are caught and shown to users
- 401 errors trigger automatic logout
- Form validation prevents invalid submissions

## Performance

- Static page generation for faster load times
- Efficient API caching with 30-60 second refresh intervals
- Optimized images and assets
- Turbopack enabled for faster builds

## Security

- JWT token-based authentication
- Secure password change functionality
- Tokens stored in localStorage
- HTTPS recommended for production
- CORS headers handled by backend

## Deployment

### To Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### To Deploy to Other Platforms

1. Build the application: `npm run build`
2. Deploy the `.next` folder to your hosting provider
3. Set environment variables in your hosting platform
4. Ensure your backend API is accessible from the deployed frontend

## Troubleshooting

### "Failed to fetch usage stats"
- Check if backend API URL is correct in `.env.local`
- Ensure backend server is running
- Check browser network tab for API request errors
- Verify CORS headers are properly configured

### Login fails with "Login failed"
- Verify email and password are correct
- Check if backend authentication endpoint is working
- Ensure JWT tokens are properly generated

### Components not loading
- Clear browser cache
- Check console for TypeScript errors
- Verify all dependencies are installed
- Restart development server

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Contributing

To add new features:

1. Create new components in `src/components/`
2. Define types in `src/types/`
3. Add API methods in `src/services/api.ts`
4. Create pages in `src/app/`
5. Follow the existing code style

## License

MIT License

## Support

For issues with the frontend, check:
1. Console errors in browser developer tools
2. Network requests in Network tab
3. Backend API response format
4. Environment variable configuration

For backend API issues, contact your Google Cloud infrastructure team.

## Next Steps

1. Update `NEXT_PUBLIC_API_URL` with your actual backend URL
2. Test login with valid credentials
3. Verify all API endpoints match your backend
4. Customize styling if needed
5. Deploy to production
