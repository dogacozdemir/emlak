# Troubleshooting Guide

## Prisma Client Not Generated

**Error:**
```
Error: @prisma/client did not initialize yet. Please run "prisma generate"
```

**Solution:**
```bash
cd apps/backend
npm run db:generate
# or
pnpm db:generate
```

This generates the Prisma Client based on your schema. You need to run this:
- After cloning the repository
- After pulling new changes that modify the Prisma schema
- After running `npm install` or `pnpm install` if Prisma Client wasn't generated

## Frontend Module Resolution Issues

**Error:**
```
Module not found: Can't resolve '@/lib/api'
```

**Solution:**

1. **Restart the Next.js dev server:**
   - Stop the current dev server (Ctrl+C)
   - Restart with `npm run dev` or `pnpm dev`

2. **Verify tsconfig.json has baseUrl:**
   The `apps/frontend/tsconfig.json` should have:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. **Clear Next.js cache:**
   ```bash
   cd apps/frontend
   rm -rf .next
   npm run dev
   ```

4. **Verify file exists:**
   ```bash
   ls -la apps/frontend/src/lib/api.ts
   ```

## Database Connection Issues

**Error:**
```
Can't reach database server
```

**Solution:**

1. **Check DATABASE_URL in .env:**
   ```bash
   # Should be in format:
   DATABASE_URL="postgresql://user:password@localhost:5432/emlak_db?schema=public"
   ```

2. **Verify PostgreSQL is running:**
   ```bash
   pg_isready
   # or
   psql -U postgres -c "SELECT 1"
   ```

3. **Create database if it doesn't exist:**
   ```bash
   createdb emlak_db
   # or using psql:
   psql -U postgres
   CREATE DATABASE emlak_db;
   ```

4. **Run migrations:**
   ```bash
   cd apps/backend
   npm run db:migrate
   ```

## Port Already in Use

**Error:**
```
Port 5001 is already in use
```

**Solution:**

1. **Change port in .env:**
   ```bash
   PORT_BACKEND=5002
   ```

2. **Or kill the process using the port:**
   ```bash
   # Find process
   lsof -i :5001
   # Kill process (replace PID)
   kill -9 <PID>
   ```

## Token Refresh Issues

**Error:**
```
Token refresh failed
```

**Solution:**

1. **Clear localStorage:**
   - Open browser DevTools
   - Application/Storage tab
   - Clear Local Storage
   - Refresh page

2. **Check JWT secrets in .env:**
   ```bash
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   ```

3. **Verify tokens are being stored:**
   ```javascript
   // In browser console:
   localStorage.getItem('accessToken')
   localStorage.getItem('refreshToken')
   ```

## Common Setup Steps

If you're setting up the project from scratch:

```bash
# 1. Install dependencies
pnpm install
# or
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Generate Prisma Client
cd apps/backend
npm run db:generate

# 4. Run migrations
npm run db:migrate

# 5. Seed database
npm run db:seed

# 6. Start development servers
cd ../..
pnpm dev
```

## Still Having Issues?

1. **Check logs:**
   - Backend: Check terminal output
   - Frontend: Check browser console and terminal

2. **Verify all dependencies are installed:**
   ```bash
   pnpm install
   ```

3. **Clear all caches:**
   ```bash
   # Frontend
   cd apps/frontend
   rm -rf .next node_modules
   npm install
   
   # Backend
   cd apps/backend
   rm -rf node_modules dist
   npm install
   ```

4. **Check Node.js version:**
   ```bash
   node -v  # Should be >= 18.0.0
   ```

