# PR #1: feat(scaffold): Monorepo scaffolding and project setup

## Summary

Initial project scaffolding for KKTC Real Estate Platform. Sets up monorepo structure with pnpm workspaces, TypeScript configuration, code quality tools, and CI/CD pipeline.

## Changes

### Monorepo Structure
- Created workspace structure: `apps/frontend`, `apps/backend`, `packages/ui`, `packages/lib`
- Configured pnpm workspaces in root `package.json`
- Added shared TypeScript, ESLint, and Prettier configurations

### Frontend (`apps/frontend`)
- Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS setup with custom color palette (primary, secondary, neutral)
- Basic layout and homepage
- ESLint configuration

### Backend (`apps/backend`)
- Express.js with TypeScript
- Basic server setup with health check endpoint
- CORS and Helmet security middleware
- ESLint configuration
- Uses `tsx` for development hot reload

### Shared Packages
- `packages/ui`: Placeholder for shared React components
- `packages/lib`: Placeholder for shared utilities and types

### Development Tools
- **Husky**: Pre-commit hooks for code quality
- **lint-staged**: Run linters only on staged files
- **ESLint**: TypeScript-aware linting rules
- **Prettier**: Consistent code formatting

### CI/CD
- GitHub Actions workflow (`.github/workflows/ci.yml`)
- Runs lint, type-check, build, and test jobs
- Triggers on push/PR to `main` and `develop` branches

### Documentation
- Comprehensive README with setup instructions
- `.env.example` with all required environment variables
- `.nvmrc` for Node.js version management

## Testing

- ✅ Both apps start successfully with `pnpm dev`
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend health check at http://localhost:5001/api/health
- ✅ Linting passes: `pnpm lint`
- ✅ Type checking passes: `pnpm type-check`
- ✅ Formatting check passes: `pnpm format:check`

## Manual QA Checklist

- [x] Run `pnpm install` - dependencies install successfully
- [x] Run `pnpm dev` - both apps start without errors
- [x] Visit http://localhost:3000 - homepage renders
- [x] Visit http://localhost:5001/api/health - returns JSON response
- [x] Run `pnpm lint` - no linting errors
- [x] Run `pnpm format:check` - code is properly formatted
- [x] Run `pnpm type-check` - no TypeScript errors
- [x] Pre-commit hook runs lint-staged (test by staging a file)

## Example Commit Messages

```
feat(scaffold): add monorepo structure with pnpm workspaces

feat(frontend): setup Next.js 14 with TypeScript and Tailwind

feat(backend): setup Express server with TypeScript

chore(ci): add GitHub Actions workflow for lint, type-check, build

chore(deps): add Husky and lint-staged for pre-commit hooks

docs: add comprehensive README with setup instructions
```

## Next Steps (Sprint 1)

- Setup Prisma schema and database models
- Create database migrations
- Add seed script with sample KKTC properties
- Implement basic API endpoints for properties

## Files Changed

```
A  .github/workflows/ci.yml
A  .gitignore
A  .husky/pre-commit
A  .nvmrc
A  .prettierrc
A  .prettierignore
A  .eslintrc.json
A  tsconfig.json
A  package.json
A  README.md
A  apps/frontend/package.json
A  apps/frontend/tsconfig.json
A  apps/frontend/next.config.js
A  apps/frontend/tailwind.config.ts
A  apps/frontend/postcss.config.js
A  apps/frontend/.eslintrc.json
A  apps/frontend/.gitignore
A  apps/frontend/src/app/layout.tsx
A  apps/frontend/src/app/page.tsx
A  apps/frontend/src/app/globals.css
A  apps/backend/package.json
A  apps/backend/tsconfig.json
A  apps/backend/.eslintrc.json
A  apps/backend/.gitignore
A  apps/backend/src/server.ts
A  packages/ui/package.json
A  packages/ui/tsconfig.json
A  packages/ui/src/index.ts
A  packages/lib/package.json
A  packages/lib/tsconfig.json
A  packages/lib/src/index.ts
```

## Acceptance Criteria

✅ Monorepo structure created with all required directories  
✅ TypeScript configured for all packages  
✅ ESLint and Prettier setup with shared configs  
✅ Husky pre-commit hooks working  
✅ GitHub Actions CI workflow created  
✅ Both apps run with `pnpm dev`  
✅ README includes setup and run instructions  
✅ `.env.example` provided with all required variables  

---

**PR Title**: `feat(scaffold): Monorepo scaffolding and project setup`

