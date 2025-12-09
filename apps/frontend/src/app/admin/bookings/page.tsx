'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { format } from 'date-fns';

interface Booking {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  adminNotes: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  property: {
    id: string;
    title: string;
    location: {
      district: string;
      neighborhood: string | null;
    };
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/bookings?status=${statusFilter}`
        : '/bookings';
      const response = await api.get<{ success: boolean; data: Booking[] }>(url);
      setBookings(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string, adminNotes?: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, {
        status,
        adminNotes: adminNotes || undefined,
      });
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">Booking Management</h1>

          <div className="mb-6 flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-neutral-600">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-neutral-600">No bookings found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {booking.property.title}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {booking.property.location.district}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900">{booking.user.name}</div>
                        <div className="text-xs text-neutral-500">{booking.user.email}</div>
                        {booking.user.phone && (
                          <div className="text-xs text-neutral-500">{booking.user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {format(new Date(booking.date), 'PPp')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500 max-w-xs">
                        {booking.notes && (
                          <div className="mb-1">
                            <strong>User:</strong> {booking.notes}
                          </div>
                        )}
                        {booking.adminNotes && (
                          <div>
                            <strong>Admin:</strong> {booking.adminNotes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking.id, 'APPROVED', 'Approved by admin')
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) {
                                  handleStatusUpdate(booking.id, 'REJECTED', reason);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {booking.status === 'APPROVED' && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, 'COMPLETED', 'Viewing completed')
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

