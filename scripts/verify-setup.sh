#!/bin/bash

# Verification script for Sprint 0 setup
# Run this after `pnpm install` to verify the monorepo is set up correctly

set -e

echo "🔍 Verifying Sprint 0 setup..."

# Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
  echo "❌ Node.js version must be >= 18. Current: $(node -v)"
  exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check pnpm
echo "📦 Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed"
  exit 1
fi
echo "✅ pnpm version: $(pnpm -v)"

# Check workspace structure
echo "📁 Checking workspace structure..."
required_dirs=("apps/frontend" "apps/backend" "packages/ui" "packages/lib")
for dir in "${required_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ Missing directory: $dir"
    exit 1
  fi
done
echo "✅ All required directories exist"

# Check package.json files
echo "📄 Checking package.json files..."
required_packages=("package.json" "apps/frontend/package.json" "apps/backend/package.json" "packages/ui/package.json" "packages/lib/package.json")
for pkg in "${required_packages[@]}"; do
  if [ ! -f "$pkg" ]; then
    echo "❌ Missing package.json: $pkg"
    exit 1
  fi
done
echo "✅ All package.json files exist"

# Check TypeScript configs
echo "📘 Checking TypeScript configurations..."
required_tsconfigs=("tsconfig.json" "apps/frontend/tsconfig.json" "apps/backend/tsconfig.json" "packages/ui/tsconfig.json" "packages/lib/tsconfig.json")
for tsconfig in "${required_tsconfigs[@]}"; do
  if [ ! -f "$tsconfig" ]; then
    echo "❌ Missing tsconfig.json: $tsconfig"
    exit 1
  fi
done
echo "✅ All TypeScript configurations exist"

# Check Husky
echo "🪝 Checking Husky setup..."
if [ ! -f ".husky/pre-commit" ]; then
  echo "❌ Husky pre-commit hook not found"
  exit 1
fi
echo "✅ Husky pre-commit hook exists"

# Check CI workflow
echo "🔄 Checking CI workflow..."
if [ ! -f ".github/workflows/ci.yml" ]; then
  echo "❌ GitHub Actions CI workflow not found"
  exit 1
fi
echo "✅ CI workflow exists"

# Check environment example
echo "🔐 Checking environment template..."
if [ ! -f ".env.example" ]; then
  echo "⚠️  .env.example not found (optional but recommended)"
else
  echo "✅ .env.example exists"
fi

echo ""
echo "🎉 All checks passed! Sprint 0 setup is complete."
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env and configure"
echo "  2. Run 'pnpm install' to install dependencies"
echo "  3. Run 'pnpm dev' to start both apps"
echo "  4. Visit http://localhost:3000 (frontend) and http://localhost:5001/api/health (backend)"

