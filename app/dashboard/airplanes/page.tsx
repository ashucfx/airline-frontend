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
  const [formData, setFormData] = useState({ modelNumber: '', capacity: 0 });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

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
      await loadAirplanes();
    };

    void initializeAirplanes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.modelNumber.trim() || formData.capacity <= 0) {
      setFormError('Model number and capacity > 0 are required');
      return;
    }
    setFormLoading(true);
    const response = await airplaneApi.create({ modelNumber: formData.modelNumber.trim(), capacity: formData.capacity });
    setFormLoading(false);
    if (!response.success) {
      setFormError(response.error || 'Failed to create airplane');
      return;
    }
    setFormData({ modelNumber: '', capacity: 0 });
    await loadAirplanes();
  };

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

        {/* Add Airplane Form */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-base font-semibold text-gray-700">Add New Airplane</h2>
          {formError && <p className="mb-2 text-sm text-red-600">{formError}</p>}
          <form onSubmit={handleCreate} className="flex gap-3 flex-wrap">
            <input
              type="text"
              required
              value={formData.modelNumber}
              onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
              placeholder="Model number (e.g. Boeing 737)"
              className="flex-1 min-w-40 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              required
              min={1}
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              placeholder="Capacity (e.g. 180)"
              className="w-40 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {formLoading ? 'Adding...' : '+ Add Airplane'}
            </button>
          </form>
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
