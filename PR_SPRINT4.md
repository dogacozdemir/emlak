# PR #5: feat(map): Leaflet map integration, marker clustering, and search filters

## Summary

Implements interactive map view with Leaflet, property markers with clustering, comprehensive search filters, and dual view mode (map/list). Users can now explore properties on a map of KKTC with real-time filtering.

## Changes

### Frontend - Map Integration

#### Map Components
- **PropertyMap** (`apps/frontend/src/components/PropertyMap.tsx`)
  - Leaflet map with OpenStreetMap tiles
  - Property markers with popups
  - Marker clustering using `react-leaflet-cluster`
  - Automatic bounds fitting
  - Custom cluster icons with count
  - Property popups with image, title, price, and link

- **Properties Page** (`apps/frontend/src/app/properties/page.tsx`)
  - Main properties search page
  - Map and list view toggle
  - Filter integration
  - Loading and error states
  - Responsive layout

#### Search Filters
- **PropertyFilters** (`apps/frontend/src/components/PropertyFilters.tsx`)
  - District filter (Famagusta, Kyrenia, Nicosia)
  - Property type filter (Apartment, Villa, House, etc.)
  - Price range (min/max)
  - Bedrooms filter (1+, 2+, 3+, etc.)
  - Available only checkbox
  - Featured only checkbox
  - Active filter badges
  - Collapsible filter panel

#### Property List
- **PropertyList** (`apps/frontend/src/components/PropertyList.tsx`)
  - Grid layout for property cards
  - Property images, title, location, price
  - Status indicators (available/sold, featured)
  - Property details (bedrooms, bathrooms, area)
  - Links to property detail pages

#### Styling
- Updated `globals.css` with Leaflet cluster marker styles
- Custom cluster marker design with primary color
- Responsive map container

### Backend - Enhanced Search

#### Geo Bounding Box Support
- Enhanced `GET /api/properties` endpoint
- Added geo bounding box parameters:
  - `minLat`, `maxLat`, `minLng`, `maxLng`
  - Filters properties within map viewport
  - Can be combined with other filters
  - Optimized for map viewport updates

### Dependencies Added
- Frontend: `react-leaflet-cluster` - Marker clustering library

## Features

### Map View
- **Interactive Map**: Full-screen map with zoom and pan
- **Property Markers**: Each property shown as a marker
- **Marker Clustering**: Properties grouped into clusters when zoomed out
- **Property Popups**: Click marker to see property preview
- **Auto-fit Bounds**: Map automatically adjusts to show all filtered properties
- **OpenStreetMap Tiles**: Free, open-source map tiles

### Search Filters
- **District**: Filter by KKTC districts
- **Property Type**: Apartment, Villa, House, Studio, Commercial, Land
- **Price Range**: Min and max price filters
- **Bedrooms**: Minimum number of bedrooms
- **Availability**: Show only available properties
- **Featured**: Show only featured properties
- **Active Filter Badges**: Visual indicators of active filters
- **Clear All**: Quick reset of all filters

### Dual View Mode
- **Map View**: Interactive map with markers
- **List View**: Grid of property cards
- **Toggle**: Easy switching between views
- **Synchronized**: Both views use same filters

## API Enhancements

### GET /api/properties

**New Query Parameters:**
- `minLat` - Minimum latitude (for geo bounding box)
- `maxLat` - Maximum latitude
- `minLng` - Minimum longitude
- `maxLng` - Maximum longitude

**Example:**
```bash
GET /api/properties?district=Kyrenia&minPrice=100000&maxPrice=500000&minLat=35.2&maxLat=35.4&minLng=33.2&maxLng=33.4
```

## Testing

### Manual Testing Checklist

- [x] Map loads with all properties - Markers displayed correctly
- [x] Marker clustering works - Clusters form when zoomed out
- [x] Property popups show correct data - Image, title, price, location
- [x] Filters work in map view - Properties update on filter change
- [x] Filters work in list view - Properties update on filter change
- [x] District filter - Only shows properties from selected district
- [x] Property type filter - Only shows selected type
- [x] Price range filter - Filters by min/max price
- [x] Bedrooms filter - Shows properties with minimum bedrooms
- [x] Available filter - Shows only available properties
- [x] Featured filter - Shows only featured properties
- [x] Multiple filters - All filters work together
- [x] Clear filters - Resets all filters
- [x] View toggle - Switches between map and list
- [x] Map bounds auto-fit - Adjusts to show all properties
- [x] Responsive design - Works on mobile and desktop

### Test Flow

1. **Navigate to Properties Page** (`/properties`)
2. **Map View**:
   - Verify map loads with markers
   - Zoom in/out to see clustering
   - Click markers to see popups
   - Apply filters and verify markers update
3. **List View**:
   - Switch to list view
   - Verify property cards display
   - Apply filters and verify list updates
4. **Filters**:
   - Select district (e.g., Kyrenia)
   - Set price range (e.g., €100,000 - €300,000)
   - Select property type (e.g., Villa)
   - Verify only matching properties show
   - Clear filters and verify all properties show

## UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Loading States**: Shows loading indicator while fetching
- **Error Handling**: Displays error messages on failure
- **Empty States**: Shows message when no properties match filters
- **Smooth Transitions**: Map and list updates smoothly
- **Accessible**: Keyboard navigation and screen reader support

## Known Limitations (Sprint 4)

- **Map Viewport Filtering**: Geo bounding box parameters are available but not yet used for real-time map viewport updates
  - Future: Implement viewport change listener to update properties as user pans/zooms
- **Location Selection**: Simplified district selection (full location management in future sprint)

## Example Commit Messages

```
feat(map): add Leaflet map with property markers

feat(map): implement marker clustering for better performance

feat(filters): create comprehensive property search filters

feat(properties): add map and list view toggle

feat(backend): add geo bounding box search support

chore: add react-leaflet-cluster dependency
```

## Next Steps (Sprint 5)

- Booking system endpoints
- Calendar-based appointment scheduling
- Conflict checking for bookings
- Admin booking approval workflow
- Email notifications for bookings

## Files Changed

```
A  apps/frontend/src/app/properties/page.tsx
A  apps/frontend/src/components/PropertyMap.tsx
A  apps/frontend/src/components/PropertyFilters.tsx
A  apps/frontend/src/components/PropertyList.tsx
M  apps/frontend/src/app/globals.css
M  apps/frontend/package.json
M  apps/backend/src/routes/properties.ts
M  README.md
```

## Acceptance Criteria

✅ Map displays all properties with markers  
✅ Marker clustering works when zoomed out  
✅ Property popups show correct information  
✅ Filters restrict results in both map and list views  
✅ District filter works  
✅ Price range filter works  
✅ Property type filter works  
✅ Bedrooms filter works  
✅ Available/featured filters work  
✅ View toggle switches between map and list  
✅ Map auto-fits to show all filtered properties  
✅ Responsive design works on mobile and desktop  

---

**PR Title**: `feat(map): Leaflet map integration, marker clustering, and search filters`

