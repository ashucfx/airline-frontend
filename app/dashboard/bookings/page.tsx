'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { bookingApiService } from '@/lib/api';

interface Booking {
  id: string;
  flightId: string;
  userId: string;
  noOfSeats: number;
  status: string;
  totalCost?: number;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ flightId: '', userId: '', noofSeats: 1 });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    const response = await bookingApiService.getAll();
    if (!response.success) {
      setBookings([]);
      setError(response.error || 'Unable to load bookings from service');
      setLoading(false);
      return;
    }
    setBookings((response.data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    const initializeBookings = async () => {
      await fetchBookings();
    };

    void initializeBookings();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.flightId || !formData.userId) {
      setFormError('Flight ID and User ID are required');
      return;
    }
    setFormLoading(true);
    const response = await bookingApiService.create({
      flightId: Number(formData.flightId),
      userId: Number(formData.userId),
      noofSeats: formData.noofSeats,
    });
    setFormLoading(false);
    if (!response.success) {
      setFormError(response.error || 'Failed to create booking');
      return;
    }
    setShowForm(false);
    setFormData({ flightId: '', userId: '', noofSeats: 1 });
    await fetchBookings();
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    setCancellingId(id);
    const response = await bookingApiService.cancel(id);
    setCancellingId(null);
    if (!response.success) {
      alert(response.error || 'Failed to cancel booking');
      return;
    }
    await fetchBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bookings Management</h1>
            <p className="text-gray-600 mt-2">View, create, and manage all bookings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            ➕ New Booking
          </button>
        </div>

        {/* Create Booking Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Booking</h2>
              {formError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight ID</label>
                  <input
                    type="number"
                    required
                    value={formData.flightId}
                    onChange={(e) => setFormData({ ...formData, flightId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input
                    type="number"
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.noofSeats}
                    onChange={(e) => setFormData({ ...formData, noofSeats: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {formLoading ? 'Creating...' : 'Create Booking'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setFormError(''); }}
                    className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-3 rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry Connection
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">Start by creating your first booking</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Create Booking
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Booking ID', 'Flight ID', 'User ID', 'Seats', 'Total Cost', 'Status', 'Created At', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                        #{String(booking.id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.flightId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.noOfSeats}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.totalCost ? `$${booking.totalCost}` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleCancel(String(booking.id))}
                          disabled={cancellingId === String(booking.id) || booking.status === 'cancelled'}
                          className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-40"
                        >
                          {cancellingId === String(booking.id) ? '...' : 'Cancel'}
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

