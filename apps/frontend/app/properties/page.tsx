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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-neutral-900 mb-2">
            Property Search
          </h1>
          <p className="text-xl text-neutral-600">
            Find your perfect property in North Cyprus
          </p>
        </div>

        {/* Filters Toggle & View Mode */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-white rounded-card shadow-soft hover:shadow-soft-lg transition-all font-medium text-neutral-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="flex gap-2 bg-white rounded-card shadow-soft p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                viewMode === 'list'
                  ? 'bg-primary-700 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                viewMode === 'map'
                  ? 'bg-primary-700 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-card shadow-soft p-6 filter-panel-enter">
            <PropertyFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-card shadow-soft">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
            <p className="mt-4 text-neutral-600">Loading properties...</p>
          </div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div className="h-[700px] rounded-card overflow-hidden shadow-soft-lg">
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
