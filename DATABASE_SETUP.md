# Database Setup Guide

## Quick Start

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql@14`
   - Linux: `sudo apt-get install postgresql-14`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create Database**
   ```bash
   createdb emlak_db
   # Or using psql:
   psql -U postgres
   CREATE DATABASE emlak_db;
   ```

3. **Configure DATABASE_URL**
   Add to `.env` file in root or `apps/backend/.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/emlak_db?schema=public"
   ```

4. **Run Migrations**
   ```bash
   cd apps/backend
   pnpm db:generate  # Generate Prisma Client
   pnpm db:migrate   # Create database tables
   ```

5. **Seed Database**
   ```bash
   pnpm db:seed      # Insert sample data
   ```

## Database Models

### User
- Stores user accounts with roles (ADMIN, AGENT, USER)
- Password is hashed using bcrypt

### Location
- KKTC geographic data
- Districts: Famagusta, Kyrenia, Nicosia
- Coordinates for map integration

### Property
- Real estate listings
- Links to User (agent/owner) and Location
- Supports various property types

### PropertyImage
- Cloudinary URLs for property photos
- Supports thumbnails and ordering

### Booking
- Viewing appointments
- Status tracking (PENDING, APPROVED, etc.)
- Conflict checking via indexes

### AdminLog
- Audit trail for admin actions
- JSON details field for flexible logging

## Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
pnpm db:generate

# Create and apply migration
pnpm db:migrate

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Seed database with sample data
pnpm db:seed

# Open Prisma Studio (database GUI)
pnpm db:studio
```

## Sample Data

The seed script creates:
- 3 users (admin, agent, user)
- 10 locations across KKTC districts
- 10 sample properties
- 2 sample bookings

**Default Credentials:**
- Admin: `admin@emlak.com` / `password123`
- Agent: `agent@emlak.com` / `password123`
- User: `user@emlak.com` / `password123`

## Troubleshooting

### Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format
- Ensure database exists: `psql -l`

### Migration Errors
- Reset database: `pnpm db:reset`
- Check for pending migrations: `pnpm db:migrate status`

### Seed Errors
- Ensure migrations are applied first
- Check for duplicate data (seed is idempotent, clears data first)

