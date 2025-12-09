# Project Structure

```
emlak/
├── .cursor/
│   └── rules/
│       └── cursorrules.mdc          # Cursor development rules
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI pipeline
├── .husky/
│   └── pre-commit                   # Git pre-commit hook
├── apps/
│   ├── frontend/                    # Next.js 14 Frontend
│   │   ├── src/
│   │   │   └── app/
│   │   │       ├── layout.tsx       # Root layout
│   │   │       ├── page.tsx         # Homepage
│   │   │       └── globals.css      # Global styles
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── postcss.config.js
│   └── backend/                     # Express Backend
│       ├── src/
│       │   └── server.ts            # Express server entry point
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── ui/                          # Shared UI Components
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── lib/                         # Shared Utilities
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── .env.example                     # Environment variables template
├── .eslintrc.json                   # ESLint configuration
├── .gitignore
├── .nvmrc                           # Node.js version
├── .prettierrc                      # Prettier configuration
├── .prettierignore
├── package.json                     # Root package.json with workspaces
├── tsconfig.json                    # Base TypeScript configuration
├── README.md                        # Project documentation
├── PR_SPRINT0.md                    # Sprint 0 PR description
└── PROJECT_STRUCTURE.md             # This file
```

## Package Dependencies

### Root
- TypeScript, Prettier, ESLint
- Husky, lint-staged

### Frontend (`apps/frontend`)
- Next.js 14, React 18
- Tailwind CSS, PostCSS
- react-leaflet, leaflet (for maps)
- @tanstack/react-query (server state)
- zustand (client state)
- zod (validation)
- axios (HTTP client)

### Backend (`apps/backend`)
- Express.js
- cors, helmet (security)
- jsonwebtoken, bcryptjs (auth)
- zod (validation)
- @prisma/client (ORM)
- tsx (dev hot reload)

### Shared Packages
- `ui`: React components (will include shadcn/ui)
- `lib`: Utilities, types, Zod schemas

