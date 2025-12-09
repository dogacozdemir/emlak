# Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- pnpm >= 8.0.0
- Cloudinary account (for image uploads)
- Resend account or SMTP server (for emails)

## Environment Setup

### 1. Database Setup

```bash
# Create production database
createdb emlak_production

# Or using psql:
psql -U postgres
CREATE DATABASE emlak_production;
```

### 2. Environment Variables

Create `.env` file with production values:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/emlak_production?schema=public"

# JWT
JWT_SECRET="<generate-strong-secret>"
JWT_REFRESH_SECRET="<generate-strong-secret>"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
RESEND_API_KEY="re_your-key"
# OR SMTP:
# SMTP_HOST="smtp.example.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@example.com"
# SMTP_PASS="your-password"

# Backend
PORT_BACKEND=5001
NODE_ENV="production"

# Frontend
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api"
NEXT_PUBLIC_MAP_TILES_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

# CORS
CORS_ORIGIN="https://yourdomain.com"
```

## Deployment Steps

### Backend Deployment

1. **Build the application:**
   ```bash
   cd apps/backend
   pnpm install --production
   pnpm build
   ```

2. **Run database migrations:**
   ```bash
   pnpm db:migrate:deploy
   ```

3. **Generate Prisma Client:**
   ```bash
   pnpm db:generate
   ```

4. **Start the server:**
   ```bash
   pnpm start
   ```

   Or using PM2:
   ```bash
   pm2 start dist/server.js --name emlak-backend
   pm2 save
   ```

### Frontend Deployment

1. **Build the application:**
   ```bash
   cd apps/frontend
   pnpm install
   pnpm build
   ```

2. **Start the server:**
   ```bash
   pnpm start
   ```

   Or deploy to Vercel/Netlify:
   ```bash
   # Vercel
   vercel --prod

   # Netlify
   netlify deploy --prod
   ```

## Docker Deployment (Optional)

### Dockerfile for Backend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 5001
CMD ["node", "apps/backend/dist/server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: emlak
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "5001:5001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/emlak
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Backend server running and healthy
- [ ] Frontend accessible
- [ ] Health check endpoint responds
- [ ] Database connection working
- [ ] Cloudinary uploads working
- [ ] Email notifications working (test)
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Monitoring set up

## Monitoring

### Health Checks

- Backend: `GET /api/health`
- Frontend: Root page loads

### Logs

- Backend logs: Check application logs
- Database logs: PostgreSQL logs
- Error tracking: Set up Sentry (future)

## Backup Strategy

### Database Backups

```bash
# Daily backup
pg_dump emlak_production > backup_$(date +%Y%m%d).sql

# Restore
psql emlak_production < backup_20241208.sql
```

### Automated Backups

Set up cron job for daily backups:
```bash
0 2 * * * pg_dump emlak_production > /backups/emlak_$(date +\%Y\%m\%d).sql
```

## Rollback Procedure

1. **Database:**
   ```bash
   # Restore previous migration
   pnpm db:migrate:rollback
   ```

2. **Application:**
   ```bash
   # Revert to previous version
   git checkout <previous-commit>
   pnpm build
   pm2 restart emlak-backend
   ```

## Security Checklist

- [ ] Strong JWT secrets (use crypto.randomBytes)
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (future)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles this)
- [ ] Environment variables secured
- [ ] Database credentials secured
- [ ] Cloudinary API keys secured

