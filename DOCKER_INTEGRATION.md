# Frontend Integration with Docker Compose

Add this service to your `airline-system-infra/docker-compose.yml`:

```yaml
  # ==============================================
  # Frontend Service
  # ==============================================
  frontend:
    build:
      context: ../airline-frontend
      dockerfile: Dockerfile
    container_name: airline-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      # API Configuration
      - NEXT_PUBLIC_API_GATEWAY_URL=http://api-gateway:8000
      - NEXT_PUBLIC_FLIGHTS_SERVICE_URL=http://flights-service:3000
      - NEXT_PUBLIC_BOOKING_SERVICE_URL=http://booking-service:3001
      
      # Feature Flags
      - NEXT_PUBLIC_ENABLE_ANALYTICS=true
      - NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
      
      # Application Info
      - NEXT_PUBLIC_APP_NAME=Airline Management System
      - NEXT_PUBLIC_APP_VERSION=1.0.0
    
    depends_on:
      api-gateway:
        condition: service_healthy
      flights-service:
        condition: service_healthy
      booking-service:
        condition: service_healthy
    
    networks:
      - airline-network
    
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Full System Startup

After adding the frontend service:

```bash
# Start all services including frontend
docker-compose up -d

# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f frontend
```

## Access Points

After startup, access:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **Flights Service**: http://localhost:3000 (backend)
- **Booking Service**: http://localhost:3001

## Default Login

Use these credentials on the login page:
- Email: `admin@airline.com`
- Password: `admin123`

## Directory Structure

Your project should look like:

```
Projects/Airline Management System/
├── API-Gateway/
├── Flights/
├── Flights-Booking-Service/
├── Noti-Service/
├── airline-frontend/          ← New frontend
└── airline-system-infra/
    └── docker-compose.yml     ← Update this file
```
