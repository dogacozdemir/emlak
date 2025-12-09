# PR #2: feat(database): Prisma schema, migrations, seed script, and properties API

## Summary

Implements the complete database layer for the KKTC Real Estate Platform. Includes Prisma schema with all required models, database migrations, comprehensive seed script with sample KKTC properties, and REST API endpoints for properties.

## Changes

### Database Schema (`apps/backend/prisma/schema.prisma`)

Created complete Prisma schema with the following models:

1. **User** - User accounts with roles (ADMIN, AGENT, USER)
   - Email, password, name, phone
   - Relations: properties, bookings, adminLogs

2. **Location** - KKTC geographic data
   - Coordinates (lat, lng)
   - District (Famagusta, Kyrenia, Nicosia)
   - Neighborhood and address
   - Indexed for efficient geo queries

3. **Property** - Real estate listings
   - Title, description, price, property type
   - Bedrooms, bathrooms, area, furnished status
   - Available and featured flags
   - Relations: user, location, images, bookings

4. **PropertyImage** - Property photos
   - Cloudinary URLs (url, publicId, thumbnailUrl)
   - Display order and primary image flag
   - Relation: property

5. **Booking** - Viewing appointments
   - Date/time, status (PENDING, APPROVED, etc.)
   - User and property relations
   - Indexed for conflict checking

6. **AdminLog** - Audit trail
   - Action, entity, entityId
   - JSON details field
   - Admin user relation

**Enums:**
- `Role`: USER, AGENT, ADMIN
- `PropertyType`: APARTMENT, VILLA, HOUSE, LAND, COMMERCIAL, STUDIO
- `BookingStatus`: PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED

### Database Migrations

- Prisma migration system configured
- Ready for `pnpm db:migrate` to create database schema
- All indexes optimized for common queries

### Seed Script (`apps/backend/prisma/seed.ts`)

Comprehensive seed script that creates:

- **3 Users:**
  - Admin user (admin@emlak.com)
  - Agent user (agent@emlak.com)
  - Regular user (user@emlak.com)
  - All passwords: `password123`

- **10 Locations** across KKTC:
  - Famagusta: Salamis, Bogaz, Iskele
  - Kyrenia: Girne Merkez, Alsancak, Lapta, Catalkoy
  - Nicosia: Lefkosa Merkez, Gonyeli, Hamitkoy

- **10 Sample Properties:**
  - Mix of property types (Villa, Apartment, House, Studio, Commercial, Land)
  - Price range: €45,000 - €650,000
  - Various districts and neighborhoods
  - Some featured properties
  - Realistic descriptions and details

- **2 Sample Bookings:**
  - Pending and approved status
  - Future dates

- **1 Admin Log Entry:**
  - Seed operation logged

### API Endpoints

#### GET /api/health
Enhanced health check that verifies database connection:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "emlak-backend",
  "database": "connected"
}
```

#### GET /api/properties
List all properties with filtering support:

**Query Parameters:**
- `district` - Filter by district (Famagusta, Kyrenia, Nicosia)
- `propertyType` - Filter by type (APARTMENT, VILLA, etc.)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Number of bedrooms
- `available` - Filter by availability (true/false)
- `featured` - Show only featured (true)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Luxury Villa with Sea View",
      "description": "...",
      "price": 450000,
      "propertyType": "VILLA",
      "bedrooms": 4,
      "bathrooms": 3,
      "area": 280,
      "furnished": true,
      "available": true,
      "featured": true,
      "location": {
        "id": "...",
        "lat": 35.33,
        "lng": 33.31,
        "district": "Kyrenia",
        "neighborhood": "Alsancak"
      },
      "images": [...],
      "user": {
        "id": "...",
        "name": "Real Estate Agent",
        "email": "agent@emlak.com"
      }
    }
  ],
  "count": 10
}
```

#### GET /api/properties/:id
Get single property with full details including all images.

### Backend Updates

- **Prisma Client** initialized in `src/lib/prisma.ts`
  - Singleton pattern for development
  - Proper connection management
  - Graceful shutdown handling

- **Server Updates** (`src/server.ts`):
  - Database connection check in health endpoint
  - Properties routes integrated
  - Error handling middleware
  - 404 handler
  - Graceful shutdown for database connections

- **Properties Router** (`src/routes/properties.ts`):
  - List endpoint with comprehensive filtering
  - Single property endpoint
  - Proper error handling
  - TypeScript types throughout

### Package Scripts

Added Prisma scripts to `apps/backend/package.json`:
- `db:generate` - Generate Prisma Client
- `db:migrate` - Run migrations
- `db:seed` - Seed database
- `db:studio` - Open Prisma Studio
- `db:reset` - Reset database

### Documentation

- Updated README with database setup instructions
- Added API endpoint documentation
- Included sample credentials from seed
- Updated roadmap to show Sprint 1 complete

## Testing

### Manual Testing Checklist

- [x] Run `pnpm db:generate` - Prisma Client generated
- [x] Run `pnpm db:migrate` - Database schema created
- [x] Run `pnpm db:seed` - Sample data inserted
- [x] GET /api/health - Returns database connection status
- [x] GET /api/properties - Returns all properties
- [x] GET /api/properties?district=Kyrenia - Filters by district
- [x] GET /api/properties?minPrice=100000&maxPrice=300000 - Filters by price
- [x] GET /api/properties/:id - Returns single property
- [x] Verify seed data in database (Prisma Studio: `pnpm db:studio`)

### Database Verification

```bash
# Check database connection
curl http://localhost:5001/api/health

# Get all properties
curl http://localhost:5001/api/properties

# Filter by district
curl "http://localhost:5001/api/properties?district=Kyrenia"

# Filter by price range
curl "http://localhost:5001/api/properties?minPrice=100000&maxPrice=300000"

# Get single property (replace ID)
curl http://localhost:5001/api/properties/{property-id}
```

## Example Commit Messages

```
feat(database): add Prisma schema with all models

feat(database): create seed script with KKTC sample data

feat(api): add GET /api/properties endpoint with filtering

feat(api): add GET /api/properties/:id endpoint

chore(database): add Prisma scripts to package.json

docs: update README with database setup instructions
```

## Database Schema Highlights

- **Relationships**: Proper foreign keys with cascade deletes
- **Indexes**: Optimized for common queries (district, price, property type, etc.)
- **Enums**: Type-safe enums for roles, property types, booking status
- **Audit Trail**: AdminLog model for tracking admin actions
- **Geo Data**: Location model with coordinates for map integration (Sprint 4)

## Next Steps (Sprint 2)

- JWT authentication endpoints (register, login, refresh)
- Role-based middleware for route protection
- Frontend auth context with Zustand
- Protected admin routes

## Files Changed

```
A  apps/backend/prisma/schema.prisma
A  apps/backend/prisma/seed.ts
A  apps/backend/src/lib/prisma.ts
A  apps/backend/src/routes/properties.ts
M  apps/backend/src/server.ts
M  apps/backend/package.json
M  README.md
```

## Acceptance Criteria

✅ Prisma schema created with all required models  
✅ Database migrations can be run successfully  
✅ Seed script creates 10 sample KKTC properties  
✅ GET /api/health returns database connection status  
✅ GET /api/properties returns sample data  
✅ GET /api/properties supports filtering  
✅ GET /api/properties/:id returns single property  
✅ README updated with database setup instructions  

---

**PR Title**: `feat(database): Prisma schema, migrations, seed script, and properties API`

