'use client';

import Link from 'next/link';
import type { Property } from '@/app/properties/page';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-card shadow-soft">
        <p className="text-neutral-600 text-lg">No properties found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/properties/${property.id}`}
          className="block bg-white rounded-card shadow-soft overflow-hidden property-card"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image - Left Side */}
            <div className="md:w-80 md:flex-shrink-0 overflow-hidden">
              {property.images.length > 0 ? (
                <img
                  src={property.images[0].thumbnailUrl || property.images[0].url}
                  alt={property.title}
                  className="w-full h-64 md:h-full md:min-h-[200px] object-cover property-card-image"
                />
              ) : (
                <div className="w-full h-64 md:h-full md:min-h-[200px] bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-neutral-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content - Right Side */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {property.featured && (
                        <span className="bg-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                      <span className="text-sm text-neutral-500 uppercase tracking-wide">
                        {property.propertyType}
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    <p className="text-neutral-600 mb-3 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location.district}
                      {property.location.neighborhood && `, ${property.location.neighborhood}`}
                    </p>
                  </div>
                </div>

                {/* Features Icons */}
                <div className="flex items-center gap-6 text-neutral-600 mb-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-sm font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <span className="text-sm font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="text-sm font-medium">{property.area} m²</span>
                    </div>
                  )}
                  {property.furnished && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-sm font-medium">Furnished</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div>
                  <div className="text-3xl font-heading font-bold text-primary-700 mb-1">
                    €{property.price.toLocaleString()}
                  </div>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      property.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {property.available ? 'Available' : 'Sold'}
                  </span>
                </div>
                <button className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg shadow-soft btn-primary">
                  <span className="btn-content">View Details</span>
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
