'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { airportApi } from '@/lib/api';

interface Airport {
  id: string;
  name: string;
  code?: string;
  address?: string;
  cityId?: string;
  createdAt?: string;
}

export default function AirportsPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAirports = async () => {
    setLoading(true);
    setError('');
    const response = await airportApi.getAll();
    if (!response.success) {
      setAirports([]);
      setError(response.error || 'Failed to fetch airports');
      setLoading(false);
      return;
    }

    setAirports((response.data as Airport[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    const initializeAirports = async () => {
      const response = await airportApi.getAll();
      if (!response.success) {
        setAirports([]);
        setError(response.error || 'Failed to fetch airports');
        setLoading(false);
        return;
      }

      setAirports((response.data as Airport[]) || []);
      setLoading(false);
    };

    void initializeAirports();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Airports</h1>
            <p className="mt-2 text-gray-600">Live data from Flights Service</p>
          </div>
          <button
            onClick={loadAirports}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-600">Loading airports...</div>
        ) : airports.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-600">No airports found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">City ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {airports.map((airport) => (
                  <tr key={airport.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{airport.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{airport.code || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{airport.address || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{airport.cityId || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
