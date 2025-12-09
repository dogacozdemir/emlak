# PR #6: feat(booking): Booking system with conflict checking and admin approval

## Summary

Implements complete booking system for property viewing appointments. Includes calendar-based scheduling, conflict checking, admin approval workflow, email notifications (placeholder), and full frontend integration with booking modal and admin management page.

## Changes

### Backend - Booking System

#### Booking Service (`apps/backend/src/services/bookingService.ts`)
- `checkBookingConflict()` - Checks for conflicts within 1 hour window
- `createBooking()` - Creates booking with conflict check
- `updateBookingStatus()` - Updates booking status (approve/reject) with conflict check
- `getBookings()` - Get bookings with filters (user, property, status)
- `getAvailableTimeSlots()` - Generate available hourly slots (9 AM - 6 PM)

#### Email Service (`apps/backend/src/services/emailService.ts`)
- `sendEmail()` - Email sending function (Resend/SMTP placeholder)
- `sendBookingConfirmationEmail()` - Sent when booking is created
- `sendBookingApprovalEmail()` - Sent when booking is approved
- `sendBookingRejectionEmail()` - Sent when booking is rejected
- Currently logs emails (ready for Resend/SMTP integration)

#### Booking Routes (`apps/backend/src/routes/bookings.ts`)
- `POST /api/bookings` - Create booking (requires auth)
  - Validates date is in future
  - Checks for conflicts
  - Sends confirmation email
- `GET /api/bookings` - Get bookings
  - Users see only their bookings
  - Admin/Agent see all bookings
  - Supports filtering by propertyId and status
- `GET /api/bookings/available-slots` - Get available time slots
  - Returns hourly slots (9 AM - 6 PM) for a given date
  - Excludes slots with conflicts
- `GET /api/bookings/:id` - Get single booking
  - Permission check (user can see own, admin/agent can see all)
- `PUT /api/bookings/:id/status` - Update booking status
  - Requires admin/agent role
  - Validates conflicts before approval
  - Sends status update email

### Frontend - Booking UI

#### Booking Modal (`apps/frontend/src/components/BookingModal.tsx`)
- Calendar date selection (react-calendar)
- Available time slot display
- Time slot selection (hourly, 9 AM - 6 PM)
- Additional notes field
- Authentication check
- Loading and error states
- Responsive design

#### Property Detail Page (`apps/frontend/src/app/properties/[id]/page.tsx`)
- Full property details display
- Image gallery
- Property information
- Contact agent section
- Book viewing button (opens modal)
- WhatsApp quick contact
- Booking modal integration

#### Admin Bookings Page (`apps/frontend/src/app/admin/bookings/page.tsx`)
- Booking list table
- Status filter dropdown
- Status color coding
- Approve/Reject buttons for pending bookings
- Mark complete for approved bookings
- Admin notes display
- User and property information

#### Navigation Updates
- Added "Bookings" link to admin navbar
- Links to booking management page

### Dependencies Added
- Frontend: `react-calendar` - Calendar component
- Frontend: `date-fns` - Date formatting utilities

## API Examples

### Create Booking
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "...",
  "date": "2024-12-15T14:00:00.000Z",
  "notes": "Interested in viewing this property"
}

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "date": "2024-12-15T14:00:00.000Z",
    "status": "PENDING",
    "user": {...},
    "property": {...}
  }
}
```

### Get Available Slots
```bash
GET /api/bookings/available-slots?propertyId=...&date=2024-12-15
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    "2024-12-15T09:00:00.000Z",
    "2024-12-15T10:00:00.000Z",
    "2024-12-15T11:00:00.000Z",
    ...
  ]
}
```

### Approve Booking
```bash
PUT /api/bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED",
  "adminNotes": "Confirmed, see you there!"
}
```

## Testing

### Manual Testing Checklist

- [x] Create booking - Booking created, conflict check works
- [x] Conflict detection - Prevents booking within 1 hour
- [x] Available slots - Returns correct available times
- [x] Get bookings - User sees own bookings, admin sees all
- [x] Approve booking - Status updated, email sent (logged)
- [x] Reject booking - Status updated, email sent (logged)
- [x] Booking modal - Calendar and time selection work
- [x] Property detail page - Booking button opens modal
- [x] Admin bookings page - List displays correctly
- [x] Status filter - Filters bookings by status
- [x] Permission checks - Users can't see others' bookings

### Test Flow

1. **As User**:
   - Navigate to property detail page
   - Click "Book Viewing Appointment"
   - Select date from calendar
   - Select available time slot
   - Add notes (optional)
   - Submit booking
   - Verify booking appears in user's bookings

2. **As Admin**:
   - Navigate to Admin → Bookings
   - See all pending bookings
   - Click "Approve" on a booking
   - Verify status changes to APPROVED
   - Check email logs (console)

3. **Conflict Test**:
   - Create booking for 2:00 PM
   - Try to create another for 2:30 PM (same property)
   - Verify conflict error
   - Try 3:00 PM (should work)

## Security Features

- **Authentication Required**: All booking operations require auth
- **Permission Checks**: Users can only see their own bookings
- **Conflict Prevention**: Atomic conflict checking prevents double bookings
- **Admin Only**: Status updates require admin/agent role
- **Date Validation**: Prevents booking in the past

## Email Notifications

Currently implemented as placeholder (logs to console). Ready for integration with:
- **Resend API**: Add `RESEND_API_KEY` to `.env`
- **SMTP**: Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` to `.env`

Email templates included:
- Booking confirmation (on create)
- Booking approval (on approve)
- Booking rejection (on reject)

## Known Limitations (Sprint 5)

- **Email Service**: Currently logs to console (Resend/SMTP integration pending)
- **Time Slots**: Fixed 9 AM - 6 PM (future: configurable per property)
- **Conflict Window**: Fixed 1 hour (future: configurable)

## Example Commit Messages

```
feat(booking): add booking service with conflict checking

feat(booking): create booking endpoints with validation

feat(booking): add email notification service (placeholder)

feat(frontend): create booking modal with calendar

feat(frontend): add property detail page with booking

feat(admin): create booking management page

chore: add react-calendar and date-fns dependencies
```

## Next Steps (Sprint 6)

- Individual property detail pages (already created, needs SEO)
- Dynamic SEO metadata (OpenGraph, Twitter Cards)
- Image gallery with lightbox
- Similar properties recommendations
- SSR optimization for SEO

## Files Changed

```
A  apps/backend/src/services/bookingService.ts
A  apps/backend/src/services/emailService.ts
A  apps/backend/src/routes/bookings.ts
M  apps/backend/src/server.ts
A  apps/frontend/src/components/BookingModal.tsx
A  apps/frontend/src/app/properties/[id]/page.tsx
A  apps/frontend/src/app/admin/bookings/page.tsx
M  apps/frontend/src/components/Navbar.tsx
M  apps/frontend/src/components/PropertyList.tsx
M  apps/frontend/src/app/properties/page.tsx
M  apps/frontend/package.json
M  README.md
```

## Acceptance Criteria

✅ POST /api/bookings creates booking with conflict check  
✅ GET /api/bookings returns user's bookings (or all for admin)  
✅ GET /api/bookings/available-slots returns available time slots  
✅ PUT /api/bookings/:id/status updates booking status  
✅ Conflict checking prevents double bookings  
✅ Booking modal works with calendar and time selection  
✅ Property detail page includes booking functionality  
✅ Admin can approve/reject bookings  
✅ Email notifications are sent (logged)  
✅ Permission checks work correctly  

---

**PR Title**: `feat(booking): Booking system with conflict checking and admin approval`

