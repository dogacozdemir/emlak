import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAdminOrAgent } from '../middleware/auth';
import {
  createBooking,
  updateBookingStatus,
  getBookings,
  getAvailableTimeSlots,
} from '../services/bookingService';
import {
  sendBookingConfirmationEmail,
  sendBookingApprovalEmail,
  sendBookingRejectionEmail,
} from '../services/emailService';
import { BookingStatus } from '@prisma/client';

const router = Router();

// Validation schemas
const createBookingSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  date: z.string().datetime().or(z.date()),
  notes: z.string().optional(),
});

const updateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  adminNotes: z.string().optional(),
});

/**
 * POST /api/bookings
 * Create a new booking (requires auth)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);

    // Parse date
    const bookingDate = typeof validatedData.date === 'string' 
      ? new Date(validatedData.date)
      : validatedData.date;

    // Validate date is in the future
    if (bookingDate < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Booking date must be in the future',
      });
    }

    const booking = await createBooking({
      userId: req.user!.userId,
      propertyId: validatedData.propertyId,
      date: bookingDate,
      notes: validatedData.notes,
    });

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(
        booking.user.email,
        booking.user.name,
        booking.property.title,
        booking.date
      );
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create booking',
    });
  }
});

/**
 * GET /api/bookings
 * Get bookings (filtered by user or admin can see all)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { propertyId, status } = req.query;

    const filters: any = {};

    // Regular users can only see their own bookings
    // Admin/Agent can see all bookings
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'AGENT') {
      filters.userId = req.user!.userId;
    }

    if (propertyId) {
      filters.propertyId = propertyId as string;
    }

    if (status) {
      filters.status = status as BookingStatus;
    }

    const bookings = await getBookings(filters);

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/bookings/available-slots
 * Get available time slots for a property on a given date
 */
router.get('/available-slots', authenticate, async (req, res) => {
  try {
    const { propertyId, date } = req.query;

    if (!propertyId || !date) {
      return res.status(400).json({
        success: false,
        error: 'propertyId and date are required',
      });
    }

    const selectedDate = new Date(date as string);
    const slots = await getAvailableTimeSlots(propertyId as string, selectedDate);

    res.json({
      success: true,
      data: slots.map((slot) => slot.toISOString()),
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available slots',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/bookings/:id/status
 * Update booking status (approve/reject) - requires admin/agent
 */
router.put('/:id/status', authenticate, requireAdminOrAgent, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateBookingSchema.parse(req.body);

    const booking = await updateBookingStatus({
      id,
      status: validatedData.status,
      adminNotes: validatedData.adminNotes,
    });

    // Send appropriate email based on status
    try {
      if (validatedData.status === BookingStatus.APPROVED) {
        await sendBookingApprovalEmail(
          booking.user.email,
          booking.user.name,
          booking.property.title,
          booking.date,
          validatedData.adminNotes
        );
      } else if (validatedData.status === BookingStatus.REJECTED) {
        await sendBookingRejectionEmail(
          booking.user.email,
          booking.user.name,
          booking.property.title,
          booking.date,
          validatedData.adminNotes
        );
      }
    } catch (emailError) {
      console.error('Failed to send booking status email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating booking:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update booking',
    });
  }
});

/**
 * GET /api/bookings/:id
 * Get a single booking by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await getBookings({});
    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check permissions
    if (
      req.user!.role !== 'ADMIN' &&
      req.user!.role !== 'AGENT' &&
      booking.userId !== req.user!.userId
    ) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view this booking',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

