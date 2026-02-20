# Airline Management System - Frontend

Enterprise dashboard for managing airline operations built with **Next.js 16**, **TypeScript**, and **Tailwind CSS 4**.

## 🚀 Features

- **Authentication System**: Secure login with JWT tokens
- **Dashboard Overview**: Real-time statistics and system status
- **Flight Management**: View, create, update, and delete flights
- **Booking Management**: Track and manage reservations
- **Airport & City Management**: Manage airport and city data
- **Airplane Management**: Track aircraft fleet
- **Analytics Dashboard**: View operational insights
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Production-Ready**: Dockerized with multi-stage builds

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | React framework |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.0.7 | Styling |

## 📋 Prerequisites

- Node.js 20+ (or Docker)
- Running backend services:
  - API Gateway (port 8000)
  - Flights Service (port 3000)
  - Booking Service (port 3001)

## 🏃 Quick Start

### Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Access the app at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Build

```bash
# Build image
docker build -t airline-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_GATEWAY_URL=http://api-gateway:8000 \
  airline-frontend
```

## ⚙️ Configuration

Create `.env.local` from template:

```env
# API Endpoints
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000
NEXT_PUBLIC_FLIGHTS_SERVICE_URL=http://localhost:3000
NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:3001

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

## 📁 Project Structure

```
airline-frontend/
├── app/                      # Next.js App Router
│   ├── api/health/          # Health check endpoint
│   ├── dashboard/           # Dashboard pages
│   │   ├── flights/         # Flight management
│   │   ├── bookings/        # Booking management
│   │   └── page.tsx         # Main dashboard
│   ├── login/               # Authentication
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   └── DashboardLayout.tsx  # Dashboard wrapper
├── lib/                     # Utilities
│   └── api.ts              # API client & services
├── public/                  # Static assets
├── Dockerfile               # Production container
├── next.config.ts           # Next.js config
└── tailwind.config.ts       # Tailwind config
```

## 🔐 Authentication

The app uses JWT-based authentication:

1. Login at `/login`
2. Token stored in localStorage
3. Token sent with all API requests via Authorization header
4. Redirects to login if token missing/invalid

**Demo Credentials:**
- Email: `admin@airline.com`
- Password: `admin123`

## 🎨 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (redirects to dashboard/login) |
| `/login` | Authentication page |
| `/dashboard` | Main dashboard with stats |
| `/dashboard/flights` | Flight management |
| `/dashboard/bookings` | Booking management |
| `/dashboard/airports` | Airport management |
| `/dashboard/cities` | City management |
| `/dashboard/airplanes` | Airplane management |
| `/dashboard/analytics` | Analytics & reports |

## 📡 API Integration

The app connects to backend microservices via `lib/api.ts`:

```typescript
import { flightApi, bookingApiService, authApi } from '@/lib/api';

// Login
const response = await authApi.login(email, password);

// Get flights
const flights = await flightApi.getAll();

// Create booking
const booking = await bookingApiService.create({
  flightId: '123',
  userId: 'user-456',
  noOfSeats: 2
});
```

## 🐳 Docker Production

Multi-stage Dockerfile optimized for production:

**Stage 1: Dependencies** - Install packages  
**Stage 2: Builder** - Build Next.js app  
**Stage 3: Runner** - Minimal runtime image  

**Features:**
- Alpine Linux base (node:20-alpine)
- Non-root user (nextjs/nodejs)
- Standalone output for smaller images
- Health check endpoint `/api/health`
- Port 3000 exposed

## 🔍 Health Check

Health endpoint at `/api/health`:

```json
{
  "status": "ok",
  "service": "airline-frontend",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚢 Deployment

### With Docker Compose

Add to `docker-compose.yml`:

```yaml
frontend:
  build: ./airline-frontend
  ports:
    - "3000:3000"
  environment:
    - NEXT_PUBLIC_API_GATEWAY_URL=http://api-gateway:8000
    - NEXT_PUBLIC_FLIGHTS_SERVICE_URL=http://flights-service:3000
    - NEXT_PUBLIC_BOOKING_SERVICE_URL=http://booking-service:3001
  depends_on:
    - api-gateway
  networks:
    - airline-network
```

## 🛡️ Security

- JWT token authentication
- CORS configured via backend services
- Environment variables for sensitive config
- Non-root Docker user
- TypeScript for type safety

## 📊 Features Breakdown

### Dashboard
- Real-time statistics (flights, bookings, airplanes)
- Quick action buttons
- System status indicators

### Flight Management
- List all flights with pagination
- Search flights by route and date
- Create/update/delete flights
- View flight details

### Booking Management
- View all bookings
- Filter by status (confirmed, pending, cancelled)
- Cancel bookings
- Create new reservations

## 🔧 Development Scripts

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_GATEWAY_URL` | `http://localhost:8000` | API Gateway URL |
| `NEXT_PUBLIC_FLIGHTS_SERVICE_URL` | `http://localhost:3000` | Flights Service URL |
| `NEXT_PUBLIC_BOOKING_SERVICE_URL` | `http://localhost:3001` | Booking Service URL |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | Enable analytics |
| `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` | `true` | Enable notifications |

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is part of the Airline Management System.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
