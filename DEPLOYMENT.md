# Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- pnpm >= 8.0.0 (or npm as fallback)
- Cloudinary account (for image uploads)
- Resend account or SMTP server (for emails)
- Git
- CloudPanel installed on Ubuntu server

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
NEXT_PUBLIC_API_URL="https://emlak.calenius.io/api"
NEXT_PUBLIC_MAP_TILES_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

# CORS
CORS_ORIGIN="https://emlak.calenius.io"
```

## CloudPanel Deployment (Ubuntu)

### Quick Start

For a faster deployment, you can use the automated deployment script:

```bash
# Clone repository
cd /home/$(whoami)/sites/emlak.calenius.io
git clone https://github.com/dogacozdemir/emlak.git .

# Run deployment script
chmod +x scripts/deploy-cloudpanel.sh
./scripts/deploy-cloudpanel.sh
```

The script will:
- Check and install pnpm if needed
- Install all dependencies
- Generate Prisma Client
- Run database migrations
- Build both backend and frontend

**Manual steps below provide more control and detailed instructions.**

---

### 1. Server Setup

#### Install pnpm (if not installed)

```bash
# SSH into your Ubuntu server
ssh user@your-server-ip

# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

**Note:** If you prefer using npm instead of pnpm, you can replace all `pnpm` commands with `npm` in the following steps. However, pnpm is recommended for monorepo workspaces.

#### Install Node.js (if not installed)

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Install PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

In PostgreSQL prompt:
```sql
CREATE DATABASE emlak_production;
CREATE USER emlak_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE emlak_production TO emlak_user;
\q
```

### 2. CloudPanel Setup

1. **Login to CloudPanel** at `https://your-server-ip:8443`

2. **Create a new site:**
   - Click "Sites" → "Add Site"
   - Domain: `emlak.calenius.io`
   - PHP Version: Not needed (Node.js app)
   - Click "Create"

3. **Configure DNS:**
   - Point `emlak.calenius.io` A record to your server IP
   - Point `*.emlak.calenius.io` A record to your server IP (for subdomains)

### 3. Clone Repository

```bash
# Navigate to CloudPanel sites directory (usually /home/username/sites/)
cd /home/$(whoami)/sites/emlak.calenius.io

# Clone the repository
git clone https://github.com/dogacozdemir/emlak.git .

# Or if directory already exists:
cd /home/$(whoami)/sites/emlak.calenius.io
git clone https://github.com/dogacozdemir/emlak.git temp
mv temp/* temp/.* . 2>/dev/null || true
rmdir temp
```

### 4. Install Dependencies

```bash
# Install pnpm if not already installed globally
npm install -g pnpm

# Install root dependencies
pnpm install
# OR if pnpm is not available: npm install

# Install backend dependencies
cd apps/backend
pnpm install
# OR: npm install

# Install frontend dependencies
cd ../frontend
pnpm install
# OR: npm install
```

### 5. Environment Variables Setup

#### Backend Environment Variables

```bash
cd /home/$(whoami)/sites/emlak.calenius.io/apps/backend

# Create .env file
nano .env
```

Add the following content:
```bash
# Database
DATABASE_URL="postgresql://emlak_user:your-secure-password@localhost:5432/emlak_production?schema=public"

# JWT (generate strong secrets)
JWT_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"
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

# CORS
CORS_ORIGIN="https://emlak.calenius.io"
```

#### Frontend Environment Variables

```bash
cd /home/$(whoami)/sites/emlak.calenius.io/apps/frontend

# Create .env.local file
nano .env.local
```

Add the following content:
```bash
NEXT_PUBLIC_API_URL="https://emlak.calenius.io/api"
NEXT_PUBLIC_MAP_TILES_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

### 6. Database Setup

```bash
cd /home/$(whoami)/sites/emlak.calenius.io/apps/backend

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate:deploy

# (Optional) Seed database
pnpm db:seed
```

### 7. Build Applications

#### Build Backend

```bash
cd /home/$(whoami)/sites/emlak.calenius.io/apps/backend
pnpm build
```

#### Build Frontend

```bash
cd /home/$(whoami)/sites/emlak.calenius.io/apps/frontend
pnpm build
```

### 8. Configure CloudPanel Node.js App

1. **In CloudPanel, go to your site settings**

2. **Create Node.js Application:**
   - Go to "Node.js" section
   - Click "Add Node.js App"
   - **Backend App:**
     - App Name: `emlak-backend`
     - Node.js Version: `18.x` or latest
     - Working Directory: `/home/username/sites/emlak.calenius.io/apps/backend`
     - Start Command: `node dist/server.js`
     - Port: `5001`
     - Environment Variables: Load from `.env` file
   - **Frontend App:**
     - App Name: `emlak-frontend`
     - Node.js Version: `18.x` or latest
     - Working Directory: `/home/username/sites/emlak.calenius.io/apps/frontend`
     - Start Command: `npm start` or `node server.js`
     - Port: `3000` (or auto-assigned)
     - Environment Variables: Load from `.env.local` file

### 9. Configure Nginx Reverse Proxy (CloudPanel)

CloudPanel will automatically create Nginx config, but you may need to customize:

1. **Backend API Proxy:**
   - In CloudPanel, go to site settings → "Nginx Config"
   - Add location block for `/api`:

```nginx
location /api {
    proxy_pass http://localhost:5001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

2. **Frontend Proxy:**
   - Default location should proxy to frontend Node.js app
   - Ensure root location proxies to frontend port

### 10. SSL Certificate (Let's Encrypt)

1. In CloudPanel, go to your site
2. Click "SSL" tab
3. Click "Let's Encrypt"
4. Select domain: `emlak.calenius.io`
5. Click "Issue Certificate"

### 11. Start Applications

#### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd /home/$(whoami)/sites/emlak.calenius.io/apps/backend
pm2 start dist/server.js --name emlak-backend
pm2 save

# Start frontend
cd /home/$(whoami)/sites/emlak.calenius.io/apps/frontend
pm2 start npm --name emlak-frontend -- start
pm2 save

# Enable PM2 startup script
pm2 startup
# Follow the instructions shown
```

#### Or use CloudPanel Node.js Apps

Start both apps from CloudPanel interface.

### 12. Verify Deployment

```bash
# Check backend health
curl https://emlak.calenius.io/api/health

# Check frontend
curl https://emlak.calenius.io

# Check PM2 status
pm2 status

# Check logs
pm2 logs emlak-backend
pm2 logs emlak-frontend
```

### 13. Update Deployment (Git Pull)

When you need to update the application:

```bash
cd /home/$(whoami)/sites/emlak.calenius.io

# Pull latest changes
git pull origin main

# Rebuild backend
cd apps/backend
pnpm install
pnpm build
pnpm db:migrate:deploy  # If there are new migrations

# Rebuild frontend
cd ../frontend
pnpm install
pnpm build

# Restart applications
pm2 restart emlak-backend
pm2 restart emlak-frontend

# Or restart via CloudPanel
```

## Alternative: Manual Deployment Steps

### Backend Deployment (Manual)

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

### Frontend Deployment (Manual)

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

- [ ] pnpm installed globally
- [ ] Node.js >= 18.0.0 installed
- [ ] PostgreSQL installed and running
- [ ] Database created (`emlak_production`)
- [ ] Database user created with proper permissions
- [ ] Repository cloned from GitHub
- [ ] Dependencies installed (root, backend, frontend)
- [ ] Environment variables configured (backend `.env`, frontend `.env.local`)
- [ ] Database migrations applied
- [ ] Prisma Client generated
- [ ] Backend built successfully
- [ ] Frontend built successfully
- [ ] CloudPanel Node.js apps configured
- [ ] Nginx reverse proxy configured (`/api` → backend)
- [ ] SSL certificate issued (Let's Encrypt)
- [ ] PM2 processes running (or CloudPanel apps started)
- [ ] Backend server running and healthy (`/api/health`)
- [ ] Frontend accessible (`https://emlak.calenius.io`)
- [ ] Health check endpoint responds
- [ ] Database connection working
- [ ] Cloudinary uploads working
- [ ] Email notifications working (test)
- [ ] Domain DNS configured correctly
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
   cd /home/$(whoami)/sites/emlak.calenius.io/apps/backend
   # Restore previous migration
   pnpm db:migrate:rollback
   ```

2. **Application:**
   ```bash
   cd /home/$(whoami)/sites/emlak.calenius.io
   # Revert to previous version
   git checkout <previous-commit>
   
   # Rebuild backend
   cd apps/backend
   pnpm build
   
   # Rebuild frontend
   cd ../frontend
   pnpm build
   
   # Restart applications
   pm2 restart emlak-backend
   pm2 restart emlak-frontend
   ```

## Troubleshooting CloudPanel Deployment

### Issue: pnpm command not found

**Solution:**
```bash
npm install -g pnpm
# Or add to PATH in ~/.bashrc or ~/.zshrc
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Issue: Port already in use

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :5001
sudo lsof -i :3000

# Kill the process or change port in .env
```

### Issue: Database connection failed

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U emlak_user -d emlak_production -h localhost

# Check DATABASE_URL in .env matches
```

### Issue: Git pull fails

**Solution:**
```bash
# Check git remote
cd /home/$(whoami)/sites/emlak.calenius.io
git remote -v

# If needed, re-add remote
git remote set-url origin https://github.com/dogacozdemir/emlak.git

# Pull with credentials
git pull origin main
```

### Issue: PM2 apps not starting on reboot

**Solution:**
```bash
# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Follow the instructions shown (usually involves sudo)
```

### Issue: Nginx 502 Bad Gateway

**Solution:**
- Check backend is running: `pm2 status`
- Check backend logs: `pm2 logs emlak-backend`
- Verify port in Nginx config matches backend port
- Check firewall: `sudo ufw status`

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

