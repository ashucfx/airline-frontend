'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { airplaneApi } from '@/lib/api';

interface Airplane {
  id: string;
  modelNumber?: string;
  capacity?: number;
  createdAt?: string;
}

export default function AirplanesPage() {
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAirplanes = async () => {
    setLoading(true);
    setError('');
    const response = await airplaneApi.getAll();
    if (!response.success) {
      setAirplanes([]);
      setError(response.error || 'Failed to fetch airplanes');
      setLoading(false);
      return;
    }

    setAirplanes((response.data as Airplane[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    const initializeAirplanes = async () => {
      const response = await airplaneApi.getAll();
      if (!response.success) {
        setAirplanes([]);
        setError(response.error || 'Failed to fetch airplanes');
        setLoading(false);
        return;
      }

      setAirplanes((response.data as Airplane[]) || []);
      setLoading(false);
    };

    void initializeAirplanes();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Airplanes</h1>
            <p className="mt-2 text-gray-600">Live data from Flights Service</p>
          </div>
          <button
            onClick={loadAirplanes}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-600">Loading airplanes...</div>
        ) : airplanes.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-600">No airplanes found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {airplanes.map((airplane) => (
                  <tr key={airplane.id}>
                    <td className="px-6 py-4 text-sm text-gray-700">{airplane.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{airplane.modelNumber || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{airplane.capacity ?? 'N/A'}</td>
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
