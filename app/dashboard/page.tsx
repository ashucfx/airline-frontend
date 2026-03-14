'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { flightApi, bookingApiService, airplaneApi } from '@/lib/api';

interface ServiceStatus {
  gateway: boolean;
  flights: boolean;
  booking: boolean;
  loading: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  loading: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function ServiceStatusItem({
  name,
  isOnline,
  loading,
}: {
  name: string;
  isOnline: boolean;
  loading: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isOnline ? 'bg-green-50' : 'bg-red-50'}`}>
      <span className="flex items-center">
        <span className={`w-3 h-3 rounded-full mr-3 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className="font-medium text-gray-700">{name}</span>
      </span>
      <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {loading ? 'Checking...' : (isOnline ? 'Online' : 'Offline')}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalBookings: 0,
    totalAirplanes: 0,
    loading: true,
  });

  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    gateway: false,
    flights: false,
    booking: false,
    loading: true,
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [flightsRes, bookingsRes, airplanesRes] = await Promise.all([
          flightApi.getAll(),
          bookingApiService.getAll(),
          airplaneApi.getAll(),
        ]);

        setStats({
          totalFlights: Array.isArray(flightsRes.data) ? flightsRes.data.length : 0,
          totalBookings: Array.isArray(bookingsRes.data) ? bookingsRes.data.length : 0,
          totalAirplanes: Array.isArray(airplanesRes.data) ? airplanesRes.data.length : 0,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }

      try {
        const [gatewayRes, flightsRes, bookingRes] = await Promise.all([
          fetch('/proxy/gateway/health').then((r) => r.ok).catch(() => false),
          fetch('/proxy/flights/health').then((r) => r.ok).catch(() => false),
          fetch('/proxy/booking/health').then((r) => r.ok).catch(() => false),
        ]);

        setServiceStatus({
          gateway: gatewayRes,
          flights: flightsRes,
          booking: bookingRes,
          loading: false,
        });
      } catch {
        setServiceStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    void initializeDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to Airline Management System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Flights"
            value={stats.totalFlights}
            icon="✈️"
            color="border-blue-500"
            loading={stats.loading}
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon="🎫"
            color="border-green-500"
            loading={stats.loading}
          />
          <StatCard
            title="Total Airplanes"
            value={stats.totalAirplanes}
            icon="🛩️"
            color="border-purple-500"
            loading={stats.loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-3xl mb-2">➕</span>
              <span className="text-sm font-medium text-gray-700">Add Flight</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-3xl mb-2">📝</span>
              <span className="text-sm font-medium text-gray-700">New Booking</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-3xl mb-2">🏢</span>
              <span className="text-sm font-medium text-gray-700">Add Airport</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <span className="text-3xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
          <div className="space-y-3">
            <ServiceStatusItem name="API Gateway" isOnline={serviceStatus.gateway} loading={serviceStatus.loading} />
            <ServiceStatusItem name="Flights Service" isOnline={serviceStatus.flights} loading={serviceStatus.loading} />
            <ServiceStatusItem name="Booking Service" isOnline={serviceStatus.booking} loading={serviceStatus.loading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
