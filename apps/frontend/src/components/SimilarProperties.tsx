'use client';

import Link from 'next/link';
import type { Property } from '@/app/properties/page';

interface SimilarPropertiesProps {
  currentProperty: {
    id: string;
    propertyType: string;
    district: string;
    price: number;
  };
  properties: Property[];
}

export default function SimilarProperties({
  currentProperty,
  properties,
}: SimilarPropertiesProps) {
  // Filter out current property and find similar ones
  const similar = properties
    .filter((p) => p.id !== currentProperty.id)
    .filter((p) => {
      // Same district or same property type
      return (
        p.location.district === currentProperty.district ||
        p.propertyType === currentProperty.propertyType
      );
    })
    .slice(0, 4); // Show max 4 similar properties

  if (similar.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {similar.map((property) => (
          <Link
            key={property.id}
            href={`/properties/${property.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden block"
          >
            {property.images.length > 0 ? (
              <img
                src={property.images[0].thumbnailUrl || property.images[0].url}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-neutral-200 flex items-center justify-center text-neutral-400">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2">
                {property.title}
              </h3>
              <p className="text-sm text-neutral-600 mb-2">
                {property.location.district}
                {property.location.neighborhood && `, ${property.location.neighborhood}`}
              </p>
              <p className="text-lg font-bold text-primary-600">
                €{property.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

