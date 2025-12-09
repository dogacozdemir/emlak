'use client';

import { useState } from 'react';
import type { Filters } from '@/app/properties/page';

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const DISTRICTS = ['Famagusta', 'Kyrenia', 'Nicosia'];
const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'HOUSE', label: 'House' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' },
];

export default function PropertyFilters({ filters, onFiltersChange }: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' || value === null ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-neutral-600 hover:text-neutral-700"
          >
            {isOpen ? 'Hide' : 'Show'} Filters
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              District
            </label>
            <select
              value={filters.district || ''}
              onChange={(e) => updateFilter('district', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm input-focus"
            >
              <option value="">All Districts</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Property Type
            </label>
            <select
              value={filters.propertyType || ''}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm input-focus"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Min Price (€)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="0"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm input-focus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Max Price (€)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="No limit"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm input-focus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms || ''}
              onChange={(e) => updateFilter('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm input-focus"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.available ?? true}
                onChange={(e) => updateFilter('available', e.target.checked ? true : undefined)}
                className="mr-2"
              />
              <span className="text-sm text-neutral-700">Available Only</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured ?? false}
                onChange={(e) => updateFilter('featured', e.target.checked ? true : undefined)}
                className="mr-2"
              />
              <span className="text-sm text-neutral-700">Featured Only</span>
            </label>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.district && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
              District: {filters.district}
            </span>
          )}
          {filters.propertyType && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
              Type: {PROPERTY_TYPES.find((t) => t.value === filters.propertyType)?.label}
            </span>
          )}
          {filters.minPrice && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
              Min: €{filters.minPrice.toLocaleString()}
            </span>
          )}
          {filters.maxPrice && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
              Max: €{filters.maxPrice.toLocaleString()}
            </span>
          )}
          {filters.bedrooms && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
              {filters.bedrooms}+ Bedrooms
            </span>
          )}
        </div>
      )}
    </div>
  );
}

