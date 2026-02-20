// API Configuration and Utilities

const API_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000',
  flights: process.env.NEXT_PUBLIC_FLIGHTS_SERVICE_URL || 'http://localhost:3000',
  booking: process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL || 'http://localhost:3001',
};

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(service: keyof typeof API_CONFIG) {
    this.baseUrl = API_CONFIG[service];
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }
}

// Service-specific clients
export const gatewayApi = new ApiClient('gateway');
export const flightsApi = new ApiClient('flights');
export const bookingApi = new ApiClient('booking');

// Authentication APIs
export const authApi = {
  login: (email: string, password: string) =>
    gatewayApi.post('/api/v1/user/signin', { email, password }),
  
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    gatewayApi.post('/api/v1/user/signup', data),
  
  logout: () => {
    gatewayApi.clearToken();
  },
};

// Flight APIs
export const flightApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    flightsApi.get(`/api/v1/flights${params ? `?page=${params.page}&limit=${params.limit}` : ''}`),
  
  getById: (id: string) =>
    flightsApi.get(`/api/v1/flights/${id}`),
  
  create: (data: any) =>
    flightsApi.post('/api/v1/flights', data),
  
  update: (id: string, data: any) =>
    flightsApi.put(`/api/v1/flights/${id}`, data),
  
  delete: (id: string) =>
    flightsApi.delete(`/api/v1/flights/${id}`),
  
  search: (params: { from: string; to: string; date: string }) =>
    flightsApi.get(`/api/v1/flights/search?from=${params.from}&to=${params.to}&date=${params.date}`),
};

// Airport APIs
export const airportApi = {
  getAll: () => flightsApi.get('/api/v1/airports'),
  getById: (id: string) => flightsApi.get(`/api/v1/airports/${id}`),
  create: (data: any) => flightsApi.post('/api/v1/airports', data),
  update: (id: string, data: any) => flightsApi.put(`/api/v1/airports/${id}`, data),
  delete: (id: string) => flightsApi.delete(`/api/v1/airports/${id}`),
};

// City APIs
export const cityApi = {
  getAll: () => flightsApi.get('/api/v1/cities'),
  getById: (id: string) => flightsApi.get(`/api/v1/cities/${id}`),
  create: (data: { name: string }) => flightsApi.post('/api/v1/cities', data),
  update: (id: string, data: { name: string }) => flightsApi.put(`/api/v1/cities/${id}`, data),
  delete: (id: string) => flightsApi.delete(`/api/v1/cities/${id}`),
};

// Airplane APIs
export const airplaneApi = {
  getAll: () => flightsApi.get('/api/v1/airplanes'),
  getById: (id: string) => flightsApi.get(`/api/v1/airplanes/${id}`),
  create: (data: { modelNumber: string; capacity: number }) =>
    flightsApi.post('/api/v1/airplanes', data),
  update: (id: string, data: { modelNumber: string; capacity: number }) =>
    flightsApi.put(`/api/v1/airplanes/${id}`, data),
  delete: (id: string) => flightsApi.delete(`/api/v1/airplanes/${id}`),
};

// Booking APIs
export const bookingApiService = {
  getAll: () => bookingApi.get('/api/v1/bookings'),
  getById: (id: string) => bookingApi.get(`/api/v1/bookings/${id}`),
  create: (data: { flightId: string; userId: string; noOfSeats: number }) =>
    bookingApi.post('/api/v1/bookings', data),
  cancel: (id: string) => bookingApi.delete(`/api/v1/bookings/${id}`),
};

export type { ApiResponse };
