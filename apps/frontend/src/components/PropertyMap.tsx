'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { Property } from '@/app/properties/page';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PropertyMapProps {
  properties: Property[];
}

// Center of KKTC
const DEFAULT_CENTER: [number, number] = [35.2, 33.4];
const DEFAULT_ZOOM = 9;

function MapBounds({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;

    const bounds = L.latLngBounds(
      properties.map((p) => [p.location.lat, p.location.lng])
    );

    if (properties.length === 1) {
      map.setView([properties[0].location.lat, properties[0].location.lng], 13);
    } else {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, map]);

  return null;
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  if (properties.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-600">No properties to display on map</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds properties={properties} />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount();
          // Dynamic size based on count
          const size = count < 10 ? 45 : count < 50 ? 50 : 60;
          const fontSize = count < 10 ? 14 : count < 50 ? 16 : 18;
          
          return L.divIcon({
            html: `
              <div class="cluster-marker-wrapper">
                <div class="cluster-marker" style="font-size: ${fontSize}px;">
                  ${count}
                </div>
              </div>
            `,
            className: 'custom-cluster',
            iconSize: L.point(size, size),
            iconAnchor: [size / 2, size / 2],
          });
        }}
      >
        {properties.map((property) => {
          const markerIcon = L.divIcon({
            html: `<div class="map-pin-hover" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">📍</div>`,
            className: 'custom-marker',
            iconSize: L.point(30, 30),
            iconAnchor: [15, 30], // Center the icon on the point
          });

          return (
            <Marker
              key={property.id}
              position={[property.location.lat, property.location.lng]}
              icon={markerIcon}
              eventHandlers={{
                mouseover: (e) => {
                  const marker = e.target;
                  marker.setZIndexOffset(1000);
                },
                mouseout: (e) => {
                  const marker = e.target;
                  marker.setZIndexOffset(0);
                },
              }}
            >
              <Popup className="tooltip-enter">
                <div className="p-2 min-w-[200px]">
                {property.images.length > 0 && (
                  <img
                    src={property.images[0].thumbnailUrl || property.images[0].url}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                <p className="text-xs text-neutral-600 mb-2">
                  {property.location.district}
                  {property.location.neighborhood && `, ${property.location.neighborhood}`}
                </p>
                <p className="text-primary-600 font-bold text-sm">
                  €{property.price.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {property.propertyType} • {property.bedrooms || 'N/A'} bed
                </p>
                <a
                  href={`/properties/${property.id}`}
                  className="text-xs text-primary-600 hover:underline mt-2 inline-block"
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

