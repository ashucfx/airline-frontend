'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { flightApi } from '@/lib/api';

interface Flight {
  id: string;
  flightNumber: string;
  airplaneId: string;
  departureAirportId: string;
  arrivalAirportId: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  boardingGate: string;
  totalSeats: number;
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFlights = async () => {
    setLoading(true);
    setError('');
    const response = await flightApi.getAll();
    if (!response.success) {
      setFlights([]);
      setError(response.error || 'Unable to load flights from service');
      setLoading(false);
      return;
    }

    setFlights((response.data as Flight[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    const initializeFlights = async () => {
      const response = await flightApi.getAll();
      if (!response.success) {
        setFlights([]);
        setError(response.error || 'Unable to load flights from service');
        setLoading(false);
        return;
      }

      setFlights((response.data as Flight[]) || []);
      setLoading(false);
    };

    void initializeFlights();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Flights Management</h1>
            <p className="text-gray-600 mt-2">Manage all flight operations</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            ➕ Add New Flight
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchFlights}
              className="mt-3 rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry Connection
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading flights...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Flights Found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first flight</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Add Flight
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arrival
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {flight.flightNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(flight.departureTime).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(flight.arrivalTime).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flight.boardingGate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${flight.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flight.totalSeats}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
