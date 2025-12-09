import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyList from '../PropertyList';
import type { Property } from '@/app/properties/page';

describe('PropertyList', () => {
  const mockProperties: Property[] = [
    {
      id: '1',
      title: 'Test Property',
      description: 'Test description',
      price: 100000,
      propertyType: 'APARTMENT',
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      furnished: true,
      available: true,
      featured: false,
      location: {
        id: 'loc1',
        lat: 35.2,
        lng: 33.4,
        district: 'Kyrenia',
        neighborhood: 'Test',
      },
      images: [],
    },
  ];

  it('should render property list', () => {
    render(<PropertyList properties={mockProperties} />);
    expect(screen.getByText('Test Property')).toBeInTheDocument();
  });

  it('should show empty state when no properties', () => {
    render(<PropertyList properties={[]} />);
    expect(screen.getByText(/No properties found/i)).toBeInTheDocument();
  });
});

