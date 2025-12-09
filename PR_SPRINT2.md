# PR #3: feat(auth): JWT authentication, role-based middleware, and frontend auth context

## Summary

Implements complete authentication system with JWT tokens, role-based access control, and frontend auth state management. Includes register, login, refresh token endpoints, middleware for route protection, and full frontend integration with Zustand.

## Changes

### Backend Authentication

#### JWT Utilities (`apps/backend/src/lib/jwt.ts`)
- `generateAccessToken()` - Generate JWT access token (15min expiry)
- `generateRefreshToken()` - Generate refresh token (7 days expiry)
- `verifyAccessToken()` - Verify and decode access token
- `verifyRefreshToken()` - Verify and decode refresh token
- `decodeToken()` - Decode token without verification

#### Auth Service (`apps/backend/src/lib/auth.ts`)
- `register()` - Register new user with password hashing (bcrypt)
- `login()` - Authenticate user and generate tokens
- `refreshAccessToken()` - Refresh access token using refresh token
- All functions return user data and tokens

#### Auth Middleware (`apps/backend/src/middleware/auth.ts`)
- `authenticate` - Verify JWT token and attach user to request
- `requireRole(...roles)` - Check if user has required role(s)
- `requireAdmin` - Require ADMIN role
- `requireAdminOrAgent` - Require ADMIN or AGENT role
- Extends Express Request type with `user` property

#### Auth Routes (`apps/backend/src/routes/auth.ts`)
- `POST /api/auth/register` - Register endpoint with Zod validation
- `POST /api/auth/login` - Login endpoint with Zod validation
- `POST /api/auth/refresh` - Refresh token endpoint
- `GET /api/auth/me` - Get current authenticated user
- All endpoints include proper error handling and validation

### Frontend Authentication

#### API Client (`apps/frontend/src/lib/api.ts`)
- Axios instance with base URL configuration
- Request interceptor: Automatically adds JWT token to headers
- Response interceptor: Handles 401 errors and token refresh
- Automatic redirect to login on auth failure

#### Auth Types (`apps/frontend/src/types/auth.ts`)
- TypeScript types for User, AuthResponse, LoginCredentials, RegisterData
- Role enum matching backend

#### Auth Store (`apps/frontend/src/store/authStore.ts`)
- Zustand store with persistence (localStorage)
- State: user, tokens, isAuthenticated, isLoading, error
- Actions: login, register, logout, fetchUser, clearError
- Helper hooks: `useIsAdmin()`, `useIsAgent()`, `useIsAuthenticated()`
- Automatic token persistence and restoration

#### Auth Pages
- **Login Page** (`apps/frontend/src/app/login/page.tsx`)
  - Email/password form
  - Error display
  - Link to register
  - Test credentials displayed
- **Register Page** (`apps/frontend/src/app/register/page.tsx`)
  - Name, email, password, phone (optional) form
  - Validation and error handling
  - Link to login

#### UI Components
- **Navbar** (`apps/frontend/src/components/Navbar.tsx`)
  - Shows login/register links when not authenticated
  - Shows user name, role, and logout when authenticated
  - Conditionally shows Admin Panel and Agent Panel links based on role
- **AuthProvider** (`apps/frontend/src/components/AuthProvider.tsx`)
  - Fetches user data on mount if token exists
  - Wraps app to provide auth context

#### Homepage Updates
- Shows welcome message for authenticated users
- Displays user role
- Shows appropriate action buttons based on role
- Login/register CTAs for unauthenticated users

### Server Integration
- Auth routes integrated into Express server
- Middleware ready for protecting routes in future sprints

## API Examples

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+90 533 123 4567"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "phone": "+90 533 123 4567"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: (same as register)
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "phone": "+90 533 123 4567",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Refresh Token
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## Testing

### Manual Testing Checklist

- [x] Register new user - Creates account and returns tokens
- [x] Login with credentials - Returns tokens
- [x] Login with invalid credentials - Returns error
- [x] Get /api/auth/me with valid token - Returns user data
- [x] Get /api/auth/me without token - Returns 401
- [x] Refresh token - Returns new tokens
- [x] Frontend login page - Form works, redirects on success
- [x] Frontend register page - Form works, redirects on success
- [x] Navbar shows/hides based on auth state
- [x] Admin panel link shows for admin users
- [x] Agent panel link shows for agent/admin users
- [x] Logout clears tokens and redirects
- [x] Token refresh on 401 - Automatically refreshes and retries request

### Test Credentials
- Admin: `admin@emlak.com` / `password123`
- Agent: `agent@emlak.com` / `password123`
- User: `user@emlak.com` / `password123`

## Security Features

- **Password Hashing**: bcrypt with salt rounds (10)
- **JWT Tokens**: Separate access (15min) and refresh (7 days) tokens
- **Token Refresh**: Automatic refresh on 401 errors
- **Role-Based Access**: Middleware for route protection
- **Input Validation**: Zod schemas for all endpoints
- **Error Handling**: Proper error messages without exposing sensitive data

## Frontend Features

- **Persistent Auth**: Zustand with localStorage persistence
- **Auto Token Refresh**: Interceptor handles token refresh automatically
- **Role-Based UI**: Components show/hide based on user role
- **Protected Routes**: Ready for route protection (next sprint)
- **Error Handling**: User-friendly error messages

## Example Commit Messages

```
feat(auth): add JWT utilities for token generation and verification

feat(auth): implement register and login endpoints

feat(auth): add role-based middleware for route protection

feat(frontend): create Zustand auth store with persistence

feat(frontend): add login and register pages

feat(frontend): implement automatic token refresh in API client

chore(auth): integrate auth routes into Express server
```

## Next Steps (Sprint 3)

- Property CRUD endpoints (create, update, delete)
- Admin panel UI for property management
- Cloudinary integration for image uploads
- Protected routes for admin/agent pages

## Files Changed

```
A  apps/backend/src/lib/jwt.ts
A  apps/backend/src/lib/auth.ts
A  apps/backend/src/middleware/auth.ts
A  apps/backend/src/routes/auth.ts
M  apps/backend/src/server.ts
A  apps/frontend/src/lib/api.ts
A  apps/frontend/src/types/auth.ts
A  apps/frontend/src/store/authStore.ts
A  apps/frontend/src/app/login/page.tsx
A  apps/frontend/src/app/register/page.tsx
A  apps/frontend/src/components/Navbar.tsx
A  apps/frontend/src/components/AuthProvider.tsx
M  apps/frontend/src/app/layout.tsx
M  apps/frontend/src/app/page.tsx
M  README.md
```

## Acceptance Criteria

✅ Register endpoint creates user and returns JWT tokens  
✅ Login endpoint authenticates and returns JWT tokens  
✅ Refresh token endpoint generates new tokens  
✅ GET /api/auth/me returns current user  
✅ Role-based middleware works (authenticate, requireRole, requireAdmin)  
✅ Frontend login page works and redirects on success  
✅ Frontend register page works and redirects on success  
✅ Frontend auth context persists across page reloads  
✅ Navbar shows/hides admin links based on role  
✅ Token refresh works automatically on 401 errors  

---

**PR Title**: `feat(auth): JWT authentication, role-based middleware, and frontend auth context`

