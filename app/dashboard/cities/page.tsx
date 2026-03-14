'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { cityApi } from '@/lib/api';

interface City {
  id: string;
  name: string;
  createdAt?: string;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCityName, setNewCityName] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const loadCities = async () => {
    setLoading(true);
    setError('');
    const response = await cityApi.getAll();
    if (!response.success) {
      setCities([]);
      setError(response.error || 'Failed to fetch cities');
      setLoading(false);
      return;
    }
    setCities((response.data as City[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    const initializeCities = async () => {
      await loadCities();
    };

    void initializeCities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newCityName.trim()) return;
    setFormLoading(true);
    const response = await cityApi.create({ name: newCityName.trim() });
    setFormLoading(false);
    if (!response.success) {
      setFormError(response.error || 'Failed to create city');
      return;
    }
    setNewCityName('');
    await loadCities();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Cities</h1>
            <p className="mt-2 text-gray-600">Live data from Flights Service</p>
          </div>
          <button
            onClick={loadCities}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Add City Form */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-base font-semibold text-gray-700">Add New City</h2>
          {formError && <p className="mb-2 text-sm text-red-600">{formError}</p>}
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              required
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="City name (e.g. London)"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {formLoading ? 'Adding...' : '+ Add City'}
            </button>
          </form>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-600">Loading cities...</div>
        ) : cities.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-600">No cities found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">City Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cities.map((city) => (
                  <tr key={city.id}>
                    <td className="px-6 py-4 text-sm text-gray-700">{city.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{city.name || 'N/A'}</td>
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
