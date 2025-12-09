# PR #4: feat(admin): Property CRUD endpoints, Cloudinary integration, and admin UI

## Summary

Implements complete property management system with CRUD operations, Cloudinary image uploads, and a full admin panel UI. Admins and agents can now create, edit, and delete properties with image uploads directly from the browser.

## Changes

### Backend - Property CRUD

#### Property Service (`apps/backend/src/services/propertyService.ts`)
- `createProperty()` - Create new property with images
- `updateProperty()` - Update property (replaces images if provided)
- `deleteProperty()` - Delete property and associated Cloudinary images
- Handles image cleanup on update/delete

#### Property Routes (`apps/backend/src/routes/properties.ts`)
- `POST /api/properties` - Create property (requires auth, admin/agent)
  - Zod validation for all fields
  - Supports multiple images with ordering
- `PUT /api/properties/:id` - Update property
  - Permission check (admin or owner)
  - Image replacement support
- `DELETE /api/properties/:id` - Delete property
  - Permission check (admin or owner)
  - Deletes images from Cloudinary

#### Cloudinary Integration (`apps/backend/src/lib/cloudinary.ts`)
- `generateUploadSignature()` - Generate signed upload signature for client
- `uploadImage()` - Server-side upload (for future use)
- `deleteImage()` - Delete image from Cloudinary
- Automatic thumbnail generation
- WebP conversion and optimization

#### Upload Route (`apps/backend/src/routes/upload.ts`)
- `GET /api/upload/signature` - Get Cloudinary upload signature
  - Requires authentication (admin/agent)
  - Returns signature, timestamp, and Cloudinary config

### Frontend - Admin UI

#### Image Upload Component (`apps/frontend/src/components/ImageUpload.tsx`)
- Drag & drop file upload
- Multiple image support (up to 10)
- Primary image selection
- Image reordering
- Thumbnail preview
- Direct upload to Cloudinary from browser
- Progress indication

#### Cloudinary Client (`apps/frontend/src/lib/cloudinary.ts`)
- `getUploadSignature()` - Fetch upload signature from backend
- `uploadToCloudinary()` - Upload image directly to Cloudinary
- Automatic thumbnail URL generation

#### Protected Route Component (`apps/frontend/src/components/ProtectedRoute.tsx`)
- Route protection based on authentication
- Role-based access control (admin/agent)
- Automatic redirect to login if not authenticated
- Loading state handling

#### Admin Pages
- **Admin Dashboard** (`apps/frontend/src/app/admin/page.tsx`)
  - Property list table with pagination
  - Image thumbnails
  - Status indicators (available/sold, featured)
  - Edit and delete actions
  - Create new property button

- **Create Property** (`apps/frontend/src/app/admin/properties/new/page.tsx`)
  - Full property form with all fields
  - Image upload component
  - Location selection (simplified for Sprint 3)
  - Validation and error handling

- **Edit Property** (`apps/frontend/src/app/admin/properties/[id]/page.tsx`)
  - Pre-filled form with existing data
  - Image management (add/remove/reorder)
  - Update functionality

### Dependencies Added
- Backend: `cloudinary` - Cloudinary SDK
- Frontend: `react-dropzone` - File upload component

## API Examples

### Create Property
```bash
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Luxury Villa in Kyrenia",
  "description": "Beautiful villa with sea view...",
  "price": 450000,
  "propertyType": "VILLA",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 280,
  "furnished": true,
  "available": true,
  "featured": true,
  "locationId": "...",
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "emlak/properties/abc123",
      "thumbnailUrl": "https://res.cloudinary.com/...",
      "order": 0,
      "isPrimary": true
    }
  ]
}
```

### Update Property
```bash
PUT /api/properties/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 475000,
  "available": false,
  "images": [...]
}
```

### Delete Property
```bash
DELETE /api/properties/:id
Authorization: Bearer <token>
```

### Get Upload Signature
```bash
GET /api/upload/signature?folder=emlak/properties
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "signature": "...",
    "timestamp": 1234567890,
    "folder": "emlak/properties",
    "cloudName": "your-cloud",
    "apiKey": "your-key"
  }
}
```

## Testing

### Manual Testing Checklist

- [x] Create property with images - Property created, images uploaded to Cloudinary
- [x] Edit property - Form pre-filled, updates saved
- [x] Delete property - Property and images deleted
- [x] Image upload - Drag & drop works, thumbnails generated
- [x] Primary image selection - First image or manually selected
- [x] Image removal - Images removed from form and Cloudinary
- [x] Permission checks - Non-admin/agent cannot access admin pages
- [x] Property owner check - Only owner or admin can edit/delete
- [x] Form validation - Required fields validated
- [x] Error handling - Proper error messages displayed

### Test Flow

1. **Login as admin** (`admin@emlak.com` / `password123`)
2. **Navigate to Admin Panel** - Should see property list
3. **Create New Property**:
   - Fill in all required fields
   - Upload 2-3 images
   - Set first image as primary
   - Submit form
   - Verify property appears in list
4. **Edit Property**:
   - Click "Edit" on a property
   - Modify title and price
   - Add/remove images
   - Save changes
   - Verify updates reflected in list
5. **Delete Property**:
   - Click "Delete" on a property
   - Confirm deletion
   - Verify property removed from list

## Security Features

- **Authentication Required**: All CRUD operations require valid JWT token
- **Role-Based Access**: Only admin and agent roles can create/edit properties
- **Owner Verification**: Only property owner or admin can update/delete
- **Signed Uploads**: Cloudinary uploads use signed signatures from backend
- **Input Validation**: Zod schemas validate all inputs
- **Image Cleanup**: Images deleted from Cloudinary when property is deleted

## Cloudinary Setup

1. **Create Cloudinary Account**: https://cloudinary.com
2. **Get Credentials**: Cloud name, API key, API secret
3. **Add to .env**:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. **Optional**: Create upload preset in Cloudinary dashboard

## Known Limitations (Sprint 3)

- **Location Selection**: Simplified to district selection only
  - Full location management (create/edit locations) will be in future sprint
  - For now, locations are created via seed script or manually in DB

- **Image Upload**: Direct to Cloudinary (no server-side processing)
  - Future: Server-side image processing and optimization

## Example Commit Messages

```
feat(backend): add property CRUD endpoints with Zod validation

feat(backend): integrate Cloudinary for image uploads

feat(backend): add property service layer with image cleanup

feat(frontend): create admin property list page

feat(frontend): add image upload component with Cloudinary

feat(frontend): implement protected route component

chore: add Cloudinary and react-dropzone dependencies
```

## Next Steps (Sprint 4)

- Map integration with Leaflet
- Property search and filtering UI
- Geo-location based search
- Cluster markers for map view
- Advanced filters (price range, property type, etc.)

## Files Changed

```
A  apps/backend/src/lib/cloudinary.ts
A  apps/backend/src/services/propertyService.ts
A  apps/backend/src/routes/upload.ts
M  apps/backend/src/routes/properties.ts
M  apps/backend/src/server.ts
M  apps/backend/package.json
A  apps/frontend/src/lib/cloudinary.ts
A  apps/frontend/src/components/ImageUpload.tsx
A  apps/frontend/src/components/ProtectedRoute.tsx
A  apps/frontend/src/app/admin/page.tsx
A  apps/frontend/src/app/admin/properties/new/page.tsx
A  apps/frontend/src/app/admin/properties/[id]/page.tsx
M  apps/frontend/package.json
M  README.md
```

## Acceptance Criteria

✅ POST /api/properties creates property with images  
✅ PUT /api/properties/:id updates property  
✅ DELETE /api/properties/:id deletes property and images  
✅ GET /api/upload/signature returns Cloudinary signature  
✅ Admin can create property with images via UI  
✅ Admin can edit property via UI  
✅ Admin can delete property via UI  
✅ Images upload directly to Cloudinary from browser  
✅ Protected routes redirect unauthorized users  
✅ Property owner verification works for edit/delete  

---

**PR Title**: `feat(admin): Property CRUD endpoints, Cloudinary integration, and admin UI`

