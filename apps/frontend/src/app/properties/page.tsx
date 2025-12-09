'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyList from '@/components/PropertyList';
import api from '@/lib/api';

// Dynamically import map to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading map...</div>,
});

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  furnished: boolean;
  available: boolean;
  featured: boolean;
  location: {
    id: string;
    lat: number;
    lng: number;
    district: string;
    neighborhood: string | null;
  };
  images: Array<{
    url: string;
    thumbnailUrl: string | null;
  }>;
}

export interface Filters {
  district?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  available?: boolean;
  featured?: boolean;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.district) params.append('district', filters.district);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
      if (filters.available !== undefined) params.append('available', filters.available.toString());
      if (filters.featured) params.append('featured', 'true');

      const response = await api.get<{ success: boolean; data: Property[] }>(
        `/properties?${params.toString()}`
      );
      setProperties(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Property Search</h1>
          <p className="text-neutral-600">Find your perfect property in KKTC</p>
        </div>

        <PropertyFilters filters={filters} onFiltersChange={setFilters} />

        <div className="mt-6 flex gap-4 mb-4">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            List View
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-neutral-600">Loading properties...</div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
                <PropertyMap properties={properties} />
              </div>
            ) : (
              <PropertyList properties={properties} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

