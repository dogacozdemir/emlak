# KKTC Emlak Platform

Production-ready real estate platform for Northern Cyprus (KKTC - Kuzey Kıbrıs Türk Cumhuriyeti).

## 🏗️ Project Structure

This is a monorepo using pnpm workspaces:

```
emlak/
├── apps/
│   ├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind
│   └── backend/           # Express + TypeScript + Prisma
├── packages/
│   ├── ui/                # Shared UI components (shadcn/ui)
│   └── lib/               # Shared utilities, types, Zod schemas
└── .cursor/rules/         # Cursor rules for development standards
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0 (use `.nvmrc` for version management)
- **pnpm**: >= 8.0.0
- **PostgreSQL**: >= 14 (for production) or SQLite (for local dev)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd emlak
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**:
   ```bash
   cd apps/backend
   pnpm db:generate    # Generate Prisma Client
   pnpm db:migrate     # Run database migrations
   pnpm db:seed        # Seed sample data
   cd ../..
   ```

5. **Run both apps in development mode**:
   ```bash
   pnpm dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

### Individual App Commands

- **Frontend only**: `pnpm dev:frontend`
- **Backend only**: `pnpm dev:backend`

## 📋 Available Scripts

### Root Level

- `pnpm dev` - Run both frontend and backend in parallel
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run all tests
- `pnpm type-check` - TypeScript type checking across all packages
- `pnpm clean` - Remove all build artifacts and node_modules

### Frontend (`apps/frontend`)

- `pnpm dev` - Start Next.js dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Backend (`apps/backend`)

- `pnpm dev` - Start Express server with hot reload (tsx watch)
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Run compiled JavaScript
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio (database GUI)
- `pnpm db:reset` - Reset database (drop, migrate, seed)

## 🛠️ Development Setup

### Environment Variables

Create a `.env` file in the root directory (see `.env.example` for reference):

**Required for Backend:**
- `DATABASE_URL` - PostgreSQL connection string (format: `postgresql://user:password@localhost:5432/dbname?schema=public`)
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_REFRESH_SECRET` - Secret for refresh token signing
- `PORT_BACKEND` - Backend server port (default: 5001)

**Required for Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5001/api)
- `NEXT_PUBLIC_MAP_TILES_URL` - Leaflet map tiles URL

**Required for Image Uploads:**
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `CLOUDINARY_UPLOAD_PRESET` - (Optional) Cloudinary upload preset

**Optional:**
- `RESEND_API_KEY` - Resend API key for email notifications
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)

### Code Quality Tools

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files only

Pre-commit hook automatically runs:
- ESLint with auto-fix
- Prettier formatting

### TypeScript Configuration

- Root `tsconfig.json` provides base configuration
- Each package extends the root config with package-specific settings
- Frontend uses Next.js TypeScript configuration
- Backend uses Node.js CommonJS module system

### Database Setup

The project uses **Prisma ORM** with **PostgreSQL**.

**Initial Setup:**
1. Ensure PostgreSQL is running locally or use a remote database
2. Set `DATABASE_URL` in `.env` file
3. Generate Prisma Client: `cd apps/backend && pnpm db:generate`
4. Run migrations: `pnpm db:migrate`
5. Seed database: `pnpm db:seed`

**Database Models:**
- `User` - Users with roles (ADMIN, AGENT, USER)
- `Property` - Real estate listings
- `PropertyImage` - Images for properties (Cloudinary URLs)
- `Location` - KKTC locations (districts, neighborhoods, coordinates)
- `Booking` - Viewing appointments
- `AdminLog` - Audit trail for admin actions

**Sample Data:**
The seed script creates:
- 3 users (admin, agent, user)
- 10 locations across Famagusta, Kyrenia, and Nicosia districts
- 10 sample properties with various types and prices
- 2 sample bookings

**Default Credentials (from seed):**
- Admin: `admin@emlak.com` / `password123`
- Agent: `agent@emlak.com` / `password123`
- User: `user@emlak.com` / `password123`

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit tests**: Vitest for both frontend and backend
- **Integration tests**: Supertest for API endpoints
- **Test coverage**: V8 coverage provider with HTML reports

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Backend only
cd apps/backend && pnpm test

# Frontend only
cd apps/frontend && pnpm test
```

### Test Coverage

Target coverage: ~70% for critical modules

View coverage reports:
- Backend: `apps/backend/coverage/index.html`
- Frontend: `apps/frontend/coverage/index.html`

## 📦 Monorepo Packages

### `packages/ui`
Shared UI components built with React and Tailwind CSS. Will include shadcn/ui components and custom components.

### `packages/lib`
Shared utilities, TypeScript types, Zod schemas, and helper functions used across frontend and backend.

## 🔄 CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**CI Pipeline:**
1. Lint & Format Check
2. TypeScript Type Check
3. Build (after lint and type-check pass)
4. Test (runs in parallel, allows failures initially)

## 📝 Development Standards

See `.cursor/rules/cursorrules.mdc` for detailed development standards including:
- TypeScript strict mode
- Prisma ORM usage
- Component architecture
- API design patterns
- Testing requirements

## 🗺️ Roadmap

### ✅ Sprint 0 - Project Scaffolding
- [x] Monorepo structure
- [x] TypeScript configuration
- [x] ESLint + Prettier setup
- [x] Husky pre-commit hooks
- [x] GitHub Actions CI skeleton
- [x] Next.js frontend scaffold
- [x] Express backend scaffold
- [x] Shared packages structure

### ✅ Sprint 1 - Data Model & DB
- [x] Prisma schema (User, Property, Location, Booking, etc.)
- [x] Database migrations
- [x] Seed script with sample KKTC properties
- [x] Health check and properties API endpoints
- [x] GET /api/properties with filtering support

### ✅ Sprint 2 - Auth + Users
- [x] JWT authentication (register, login, refresh)
- [x] Role-based middleware (admin, agent, user)
- [x] Frontend auth context with Zustand
- [x] Login and register pages
- [x] Protected routes and role-based UI

### ✅ Sprint 3 - Property CRUD + Admin UI
- [x] Property CRUD endpoints (POST, PUT, DELETE)
- [x] Cloudinary integration for image uploads
- [x] Admin panel with property list, create, and edit pages
- [x] Image upload component with drag & drop
- [x] Protected admin routes

### ✅ Sprint 4 - Map & Search
- [x] Leaflet map integration with property markers
- [x] Marker clustering for better performance
- [x] Search filters (district, price, bedrooms, type)
- [x] Map and list view toggle
- [x] Geo bounding box search support

### 📅 Remaining Sprints

### ✅ Sprint 5 - Booking System
- [x] Booking endpoints (create, list, approve/reject)
- [x] Calendar-based appointment scheduling
- [x] Conflict checking for booking slots
- [x] Admin booking approval workflow
- [x] Email notifications (Resend/SMTP placeholder)
- [x] Frontend booking modal on property pages
- [x] Property detail pages with booking functionality

### ✅ Sprint 6 - Public Property Pages + SEO
- [x] Individual property detail pages
- [x] Dynamic SEO metadata (OpenGraph, Twitter Cards)
- [x] Image gallery with lightbox
- [x] WhatsApp quick contact
- [x] Similar properties recommendations
- [x] Property sharing functionality
- [x] Client-side metadata updates for SEO

### ✅ Sprint 7 - Tests, CI, Docs, Deploy
- [x] Unit tests (Vitest for frontend and backend)
- [x] Integration tests (Supertest for API endpoints)
- [x] GitHub Actions CI pipeline with test step
- [x] Test coverage reporting setup
- [x] Deployment documentation
- [x] Test configuration files

## 🐛 Troubleshooting

### Port 5000 already in use
The backend uses port 5001 by default. If you need to change it, update `PORT_BACKEND` in `.env`.

### pnpm not found
Install pnpm globally:
```bash
npm install -g pnpm
```

### TypeScript errors
Run type checking:
```bash
pnpm type-check
```

### Linting errors
Auto-fix most issues:
```bash
pnpm lint:fix
pnpm format
```

## 📄 License

[Add your license here]

## 👥 Contributing

[Add contributing guidelines here]

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server and database health status

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ email, password, name, phone? }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
- `POST /api/auth/refresh` - Refresh access token
  - Body: `{ refreshToken }`
- `GET /api/auth/me` - Get current user (requires auth)
  - Headers: `Authorization: Bearer <token>`

### Properties
- `GET /api/properties` - Get all properties (with optional filters)
  - Query params: `district`, `propertyType`, `minPrice`, `maxPrice`, `bedrooms`, `available`, `featured`
  - Geo params: `minLat`, `maxLat`, `minLng`, `maxLng` (for map viewport filtering)
  - Example: `/api/properties?district=Kyrenia&minPrice=100000&maxPrice=300000`
  - Example: `/api/properties?minLat=35.1&maxLat=35.3&minLng=33.2&maxLng=33.5`
- `GET /api/properties/:id` - Get single property by ID
- `POST /api/properties` - Create property (requires auth, admin/agent)
- `PUT /api/properties/:id` - Update property (requires auth, admin/agent, owner)
- `DELETE /api/properties/:id` - Delete property (requires auth, admin/agent, owner)

### Upload
- `GET /api/upload/signature` - Get Cloudinary upload signature (requires auth, admin/agent)

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
  - Body: `{ propertyId, date, notes? }`
- `GET /api/bookings` - Get bookings (filtered by user, admin sees all)
  - Query params: `propertyId`, `status`
- `GET /api/bookings/available-slots` - Get available time slots for a property
  - Query params: `propertyId`, `date`
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/status` - Update booking status (requires auth, admin/agent)
  - Body: `{ status, adminNotes? }`

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Luxury Villa with Sea View",
      "price": 450000,
      "propertyType": "VILLA",
      "bedrooms": 4,
      "location": {
        "district": "Kyrenia",
        "neighborhood": "Alsancak"
      },
      "images": [...]
    }
  ],
  "count": 10
}
```

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for authentication with access and refresh tokens.

**User Roles:**
- `USER` - Regular users (default)
- `AGENT` - Real estate agents
- `ADMIN` - Administrators

**Frontend Auth:**
- Zustand store for state management
- Automatic token refresh on 401 errors
- Role-based UI (admin/agent panels shown based on role)
- Protected routes (ready for implementation)

**Test Credentials (from seed):**
- Admin: `admin@emlak.com` / `password123`
- Agent: `agent@emlak.com` / `password123`
- User: `user@emlak.com` / `password123`

## 🖼️ Image Uploads

The platform uses Cloudinary for image storage and optimization:

- **Client-side uploads**: Images are uploaded directly from the browser to Cloudinary
- **Automatic optimization**: Images are automatically converted to WebP and resized
- **Thumbnails**: Thumbnails are generated automatically (400x300px)
- **Signed uploads**: Backend generates signed upload signatures for security

**Setup:**
1. Create a Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret
3. Add them to `.env` file
4. (Optional) Create an upload preset in Cloudinary dashboard

## 🗺️ Map & Search

The platform includes an interactive map view powered by Leaflet:

- **Interactive Map**: View all properties on a map of KKTC
- **Marker Clustering**: Properties are grouped into clusters for better performance
- **Search Filters**: Filter by district, property type, price range, bedrooms, availability
- **Dual View**: Toggle between map view and list view
- **Property Popups**: Click markers to see property details and navigate to full listing

**Map Features:**
- OpenStreetMap tiles (free and open source)
- Automatic bounds fitting when filters change
- Responsive design for mobile and desktop
- Cluster markers show property count

## 📅 Booking System

The platform includes a complete booking system for property viewings:

- **Calendar Selection**: Users select date from calendar
- **Time Slots**: Available hourly slots (9 AM - 6 PM)
- **Conflict Checking**: Prevents double bookings (1 hour buffer)
- **Admin Approval**: Admins can approve/reject bookings
- **Email Notifications**: Confirmation emails sent (Resend/SMTP placeholder)
- **Status Tracking**: PENDING → APPROVED/REJECTED → COMPLETED

**Booking Flow:**
1. User selects property and clicks "Book Viewing"
2. Calendar opens, user selects date
3. Available time slots displayed
4. User selects time and adds notes (optional)
5. Booking created with PENDING status
6. Admin receives notification (future: email)
7. Admin approves/rejects booking
8. User receives status update email

## 🔍 SEO & Public Pages

Property pages are optimized for search engines and social sharing:

- **Dynamic Metadata**: OpenGraph and Twitter Card tags
- **Image Gallery**: Lightbox with navigation
- **Similar Properties**: Recommendations based on district and type
- **Social Sharing**: Native share API with clipboard fallback
- **WhatsApp Contact**: Quick contact button with pre-filled message
- **Client-Side SEO**: Metadata updates dynamically based on property data

**SEO Features:**
- Dynamic page titles
- Meta descriptions
- OpenGraph tags for social sharing
- Twitter Card support
- Image optimization for social previews

## 🚀 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions including:
- Environment setup
- Database migrations
- Backend and frontend deployment
- Docker configuration
- Post-deployment checklist
- Backup strategy
- Security checklist

---

**Status**: All Sprints Complete ✅ | Project Ready for Production

