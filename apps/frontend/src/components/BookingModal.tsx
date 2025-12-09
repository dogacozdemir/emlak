'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface BookingModalProps {
  propertyId: string;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function BookingModal({
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const { isAuthenticated } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, isOpen]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    try {
      setLoadingSlots(true);
      const response = await api.get<{ success: boolean; data: string[] }>(
        `/bookings/available-slots?propertyId=${propertyId}&date=${selectedDate.toISOString()}`
      );
      setAvailableSlots(response.data.data);
    } catch (err) {
      console.error('Failed to fetch available slots:', err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('Please login to book a viewing');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    try {
      setLoading(true);
      const bookingDateTime = new Date(selectedTime);

      await api.post('/bookings', {
        propertyId,
        date: bookingDateTime.toISOString(),
        notes: notes || undefined,
      });

      onSuccess();
      onClose();
      // Reset form
      setSelectedDate(null);
      setSelectedTime('');
      setNotes('');
      setAvailableSlots([]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Tomorrow

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-neutral-900">
              Book Viewing Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 text-2xl"
            >
              ×
            </button>
          </div>

          <p className="text-neutral-600 mb-6">{propertyTitle}</p>

          {!isAuthenticated && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
              Please login to book a viewing appointment.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Select Date
              </label>
              <div className="flex justify-center">
                <Calendar
                  onChange={(value) => {
                    const date = Array.isArray(value) ? value[0] : value;
                    setSelectedDate(date);
                    setSelectedTime(''); // Reset time when date changes
                  }}
                  value={selectedDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  tileDisabled={({ date }) => {
                    // Disable past dates
                    return date < minDate;
                  }}
                />
              </div>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Time
                </label>
                {loadingSlots ? (
                  <div className="text-center py-4 text-neutral-600">
                    Loading available slots...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-4 text-neutral-600">
                    No available slots for this date
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const slotDate = new Date(slot);
                      const timeString = format(slotDate, 'HH:mm');
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedTime === slot
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-400'
                          }`}
                        >
                          {timeString}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Any special requests or questions..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !isAuthenticated || !selectedDate || !selectedTime}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

