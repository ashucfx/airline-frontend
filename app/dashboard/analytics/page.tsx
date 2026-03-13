'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { bookingApiService, flightApi, airplaneApi } from '@/lib/api';

interface Flight {
  price?: number;
  totalSeats?: number;
}

interface Booking {
  totalCost?: number;
  noOfSeats?: number;
  status?: string;
}

export default function AnalyticsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [airplanesCount, setAirplanesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [services, setServices] = useState({
    gateway: false,
    flights: false,
    bookings: false,
    notification: false,
  });

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');

    const [flightRes, bookingRes, airplaneRes] = await Promise.all([
      flightApi.getAll(),
      bookingApiService.getAll(),
      airplaneApi.getAll(),
    ]);

    if (!flightRes.success || !bookingRes.success || !airplaneRes.success) {
      setError('One or more services failed while loading analytics data.');
      setLoading(false);
      return;
    }

    const flightData = (flightRes.data as Flight[]) || [];
    const bookingData = (bookingRes.data as Booking[]) || [];
    const airplaneData = (airplaneRes.data as unknown[]) || [];

    setFlights(flightData);
    setBookings(bookingData);
    setAirplanesCount(airplaneData.length);
    setLoading(false);
  };

  const checkHealth = async () => {
    const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    const flightsUrl = process.env.NEXT_PUBLIC_FLIGHTS_SERVICE_URL;
    const bookingsUrl = process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL;
    const notificationUrl = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL;

    const [gateway, flightsService, bookingsService, notification] = await Promise.all([
      fetch(`${gatewayUrl}/health`).then((r) => r.ok).catch(() => false),
      fetch(`${flightsUrl}/health`).then((r) => r.ok).catch(() => false),
      fetch(`${bookingsUrl}/health`).then((r) => r.ok).catch(() => false),
      notificationUrl ? fetch(`${notificationUrl}/health`).then((r) => r.ok).catch(() => false) : Promise.resolve(false),
    ]);

    setServices({
      gateway,
      flights: flightsService,
      bookings: bookingsService,
      notification,
    });
  };

  useEffect(() => {
    const initializeAnalytics = async () => {
      const [flightRes, bookingRes, airplaneRes] = await Promise.all([
        flightApi.getAll(),
        bookingApiService.getAll(),
        airplaneApi.getAll(),
      ]);

      if (!flightRes.success || !bookingRes.success || !airplaneRes.success) {
        setError('One or more services failed while loading analytics data.');
        setLoading(false);
      } else {
        setFlights((flightRes.data as Flight[]) || []);
        setBookings((bookingRes.data as Booking[]) || []);
        setAirplanesCount(((airplaneRes.data as unknown[]) || []).length);
        setLoading(false);
      }

      await checkHealth();
    };

    void initializeAnalytics();
  }, []);

  const metrics = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, booking) => sum + (Number(booking.totalCost) || 0), 0);
    const seatsBooked = bookings.reduce((sum, booking) => sum + (Number(booking.noOfSeats) || 0), 0);
    const totalCapacity = flights.reduce((sum, flight) => sum + (Number(flight.totalSeats) || 0), 0);
    const avgFlightPrice = flights.length > 0
      ? flights.reduce((sum, flight) => sum + (Number(flight.price) || 0), 0) / flights.length
      : 0;

    return {
      totalRevenue,
      seatsBooked,
      totalCapacity,
      avgFlightPrice,
    };
  }, [bookings, flights]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Revenue & Operations Analytics</h1>
            <p className="mt-2 text-gray-600">Aggregated from Flights and Booking microservices</p>
          </div>
          <button
            onClick={() => {
              loadAnalytics();
              checkHealth();
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Refresh Analytics
          </button>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Seats Booked</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{metrics.seatsBooked}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Fleet Size</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{airplanesCount}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Average Flight Price</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">${metrics.avgFlightPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Live Microservice Health</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <StatusRow title="API Gateway" ok={services.gateway} />
            <StatusRow title="Flights Service" ok={services.flights} />
            <StatusRow title="Booking Service" ok={services.bookings} />
            <StatusRow title="Notification Service" ok={services.notification} />
          </div>
        </div>

        {loading && <div className="rounded-xl bg-white p-6 text-gray-600">Refreshing analytics data...</div>}
      </div>
    </DashboardLayout>
  );
}

function StatusRow({ title, ok }: { title: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
      <span className="text-sm font-medium text-gray-800">{title}</span>
      <span className={`rounded px-2 py-1 text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {ok ? 'Healthy' : 'Unavailable'}
      </span>
    </div>
  );
}
