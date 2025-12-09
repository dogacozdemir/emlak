#!/bin/bash

# CloudPanel Deployment Script for KKTC Emlak Platform
# Domain: emlak.calenius.io
# Usage: ./scripts/deploy-cloudpanel.sh

set -e  # Exit on error

echo "🚀 Starting CloudPanel Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}⚠️  Warning: Running as root is not recommended${NC}"
   echo -e "${YELLOW}Please run this script as the site owner user (usually the CloudPanel site user)${NC}"
   echo -e "${YELLOW}Example: su - username (then run the script)${NC}"
   read -p "Continue anyway? (y/N): " -n 1 -r
   echo
   if [[ ! $REPLY =~ ^[Yy]$ ]]; then
       exit 1
   fi
fi

# Show current user
echo -e "${GREEN}Running as user: $(whoami)${NC}"

# Get current directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo -e "${GREEN}Project directory: $PROJECT_DIR${NC}"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm not found. Installing pnpm...${NC}"
    if [ "$EUID" -eq 0 ]; then
        npm install -g pnpm
    else
        echo -e "${YELLOW}Attempting to install pnpm globally (may require sudo)...${NC}"
        sudo npm install -g pnpm || npm install -g pnpm --user || {
            echo -e "${RED}Failed to install pnpm. Please install manually: npm install -g pnpm${NC}"
            exit 1
        }
    fi
else
    echo -e "${GREEN}pnpm is installed ($(pnpm --version))${NC}"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js >= 18.0.0${NC}"
    exit 1
else
    echo -e "${GREEN}Node.js is installed ($(node --version))${NC}"
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL client not found. Make sure PostgreSQL is installed.${NC}"
else
    echo -e "${GREEN}PostgreSQL client found${NC}"
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
pnpm install || npm install

# Backend setup
echo -e "${GREEN}Setting up backend...${NC}"
cd apps/backend

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found in apps/backend/${NC}"
    echo -e "${YELLOW}Please create .env file with required environment variables${NC}"
    echo -e "${YELLOW}See DEPLOYMENT.md for required variables${NC}"
else
    echo -e "${GREEN}.env file found${NC}"
fi

# Generate Prisma Client
echo -e "${GREEN}Generating Prisma Client...${NC}"
pnpm db:generate || npm run db:generate

# Run migrations
echo -e "${GREEN}Running database migrations...${NC}"
if pnpm db:migrate:deploy 2>/dev/null || npm run db:migrate:deploy 2>/dev/null; then
    echo -e "${GREEN}Migrations completed successfully${NC}"
else
    echo -e "${YELLOW}Migration failed. Make sure DATABASE_URL is correct in .env file${NC}"
    echo -e "${YELLOW}You can run migrations manually later${NC}"
fi

# Build backend
echo -e "${GREEN}Building backend...${NC}"
pnpm build || npm run build

cd ../..

# Frontend setup
echo -e "${GREEN}Setting up frontend...${NC}"
cd apps/frontend

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Warning: .env.local file not found in apps/frontend/${NC}"
    echo -e "${YELLOW}Please create .env.local file with required environment variables${NC}"
    echo -e "${YELLOW}See DEPLOYMENT.md for required variables${NC}"
else
    echo -e "${GREEN}.env.local file found${NC}"
fi

# Build frontend
echo -e "${GREEN}Building frontend...${NC}"
pnpm build || npm run build

cd ../..

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure CloudPanel Node.js apps (see DEPLOYMENT.md)"
echo "2. Configure Nginx reverse proxy for /api endpoint"
echo "3. Set up SSL certificate (Let's Encrypt)"
echo "4. Start applications with PM2 or CloudPanel"
echo ""
echo -e "${GREEN}Deployment script completed!${NC}"

