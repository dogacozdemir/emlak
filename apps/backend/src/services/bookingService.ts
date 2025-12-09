import prisma from '../lib/prisma';
import { BookingStatus } from '@prisma/client';

export interface CreateBookingData {
  userId: string;
  propertyId: string;
  date: Date;
  notes?: string;
}

export interface UpdateBookingData {
  id: string;
  status?: BookingStatus;
  adminNotes?: string;
}

/**
 * Check if a booking slot conflicts with existing bookings
 * Returns true if there's a conflict (another booking within 1 hour)
 */
export async function checkBookingConflict(
  propertyId: string,
  date: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const oneHourBefore = new Date(date);
  oneHourBefore.setHours(oneHourBefore.getHours() - 1);

  const oneHourAfter = new Date(date);
  oneHourAfter.setHours(oneHourAfter.getHours() + 1);

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      propertyId,
      date: {
        gte: oneHourBefore,
        lte: oneHourAfter,
      },
      status: {
        in: [BookingStatus.PENDING, BookingStatus.APPROVED],
      },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
    },
  });

  return conflictingBooking !== null;
}

/**
 * Create a new booking with conflict check
 */
export async function createBooking(data: CreateBookingData) {
  // Check for conflicts
  const hasConflict = await checkBookingConflict(data.propertyId, data.date);

  if (hasConflict) {
    throw new Error(
      'This time slot is already booked. Please choose another time (1 hour apart required).'
    );
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      userId: data.userId,
      propertyId: data.propertyId,
      date: data.date,
      notes: data.notes || null,
      status: BookingStatus.PENDING,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          location: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  return booking;
}

/**
 * Update booking status (approve/reject)
 */
export async function updateBookingStatus(data: UpdateBookingData) {
  const booking = await prisma.booking.findUnique({
    where: { id: data.id },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // If approving, check for conflicts
  if (data.status === BookingStatus.APPROVED) {
    const hasConflict = await checkBookingConflict(
      booking.propertyId,
      booking.date,
      booking.id
    );

    if (hasConflict) {
      throw new Error(
        'Cannot approve: This time slot conflicts with another approved booking.'
      );
    }
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: data.id },
    data: {
      status: data.status,
      adminNotes: data.adminNotes || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          location: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  return updatedBooking;
}

/**
 * Get bookings with filters
 */
export async function getBookings(filters: {
  userId?: string;
  propertyId?: string;
  status?: BookingStatus;
  adminId?: string; // For admin viewing all bookings
}) {
  const where: any = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.propertyId) {
    where.propertyId = filters.propertyId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          location: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return bookings;
}

/**
 * Get available time slots for a property on a given date
 */
export async function getAvailableTimeSlots(propertyId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(9, 0, 0, 0); // 9 AM

  const endOfDay = new Date(date);
  endOfDay.setHours(18, 0, 0, 0); // 6 PM

  // Get existing bookings for this day
  const existingBookings = await prisma.booking.findMany({
    where: {
      propertyId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: [BookingStatus.PENDING, BookingStatus.APPROVED],
      },
    },
  });

  // Generate available slots (every hour from 9 AM to 6 PM)
  const availableSlots: Date[] = [];
  const currentSlot = new Date(startOfDay);

  while (currentSlot <= endOfDay) {
    // Check if this slot conflicts with existing bookings
    const hasConflict = existingBookings.some((booking) => {
      const bookingTime = new Date(booking.date).getTime();
      const slotTime = currentSlot.getTime();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

      return Math.abs(bookingTime - slotTime) < oneHour;
    });

    if (!hasConflict) {
      availableSlots.push(new Date(currentSlot));
    }

    currentSlot.setHours(currentSlot.getHours() + 1);
  }

  return availableSlots;
}

