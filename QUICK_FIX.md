# Quick Fix: Cloudinary Module Not Found

## Issue
Error: `Cannot find module 'cloudinary'` when running backend

## Solution

The dependencies have been installed. If you're still seeing the error:

1. **Restart the backend server** - The module should now be available
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **If using npm instead of pnpm** (as configured):
   - The project is configured for `pnpm` but `npm` workspaces should also work
   - Dependencies are installed in root `node_modules` and should be accessible
   - If issues persist, try installing directly in backend:
     ```bash
     cd apps/backend
     npm install cloudinary
     ```

3. **Clear cache and reinstall** (if still not working):
   ```bash
   # From root
   rm -rf node_modules apps/*/node_modules
   npm install --ignore-scripts
   ```

## Verify Installation

Check if cloudinary is installed:
```bash
npm list cloudinary
# Should show: cloudinary@1.41.3
```

## Note

The project is configured to use `pnpm` (see `package.json`), but `npm` workspaces should work too. For best compatibility, consider using pnpm:

```bash
npm install -g pnpm
pnpm install
```

