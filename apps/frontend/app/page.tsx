'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

interface Property {
  id: string;
  title: string;
  price: number;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  featured: boolean;
  location: {
    district: string;
    neighborhood: string | null;
  };
  images: Array<{
    url: string;
    thumbnailUrl: string | null;
  }>;
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    district: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
  });
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const minSliderRef = useRef<HTMLInputElement>(null);
  const maxSliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Property[] }>(
        '/properties?featured=true'
      );
      setFeaturedProperties(response.data.data.slice(0, 4));
    } catch (err) {
      console.error('Failed to load featured properties:', err);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchFilters.district) params.append('district', searchFilters.district);
    if (searchFilters.propertyType) params.append('propertyType', searchFilters.propertyType);
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] < 1000000) params.append('maxPrice', priceRange[1].toString());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-900/60 to-primary-950/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight hero-fade-in">
            Find Your Cypriot Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-neutral-100 max-w-2xl mx-auto hero-fade-in hero-fade-in-delay-1">
            Discover luxury properties in North Cyprus with verified listings and expert agents
          </p>

          {/* Search Module */}
          <form 
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-card shadow-soft-lg p-6 md:p-8 hero-fade-in hero-fade-in-delay-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                <select
                  value={searchFilters.district}
                  onChange={(e) => setSearchFilters({ ...searchFilters, district: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 input-focus text-neutral-900"
                >
                  <option value="">All Districts</option>
                  <option value="Nicosia">Nicosia</option>
                  <option value="Kyrenia">Kyrenia</option>
                  <option value="Famagusta">Famagusta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Property Type</label>
                <select
                  value={searchFilters.propertyType}
                  onChange={(e) => setSearchFilters({ ...searchFilters, propertyType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 input-focus text-neutral-900"
                >
                  <option value="">All Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="HOUSE">House</option>
                  <option value="STUDIO">Studio</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="LAND">Land</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Price Range: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
                </label>
                <div className="relative py-4">
                  {/* Range Track Background */}
                  <div className="relative h-2 bg-neutral-200 rounded-lg">
                    {/* Active Range Fill */}
                    <div
                      className="absolute h-2 bg-primary-700 rounded-lg"
                      style={{
                        left: `${(priceRange[0] / 1000000) * 100}%`,
                        width: `${((priceRange[1] - priceRange[0]) / 1000000) * 100}%`,
                      }}
                    />
                  </div>
                  
                  {/* Dual Range Slider Container */}
                  <div className="relative h-2" style={{ marginTop: '16px' }}>
                    {/* Min Slider */}
                    <input
                      ref={minSliderRef}
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const newMin = Math.min(parseInt(e.target.value), priceRange[1] - 10000);
                        setPriceRange([newMin, priceRange[1]]);
                      }}
                      className="absolute top-0 w-full h-2 bg-transparent appearance-none slider-thumb"
                      style={{
                        left: 0,
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        zIndex: 20,
                        pointerEvents: 'none', // Track'e tıklamayı engelle
                      }}
                    />
                    
                    {/* Max Slider */}
                    <input
                      ref={maxSliderRef}
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newMax = Math.max(parseInt(e.target.value), priceRange[0] + 10000);
                        setPriceRange([priceRange[0], newMax]);
                      }}
                      className="absolute top-0 w-full h-2 bg-transparent appearance-none slider-thumb"
                      style={{
                        left: 0,
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        zIndex: 30,
                        pointerEvents: 'none', // Track'e tıklamayı engelle
                      }}
                    />
                    
                    {/* Visual Min Thumb - Tıklanabilir */}
                    <div
                      className="absolute w-4 h-4 bg-primary-700 rounded-full shadow-soft cursor-grab active:cursor-grabbing z-40"
                      style={{ 
                        left: `calc(${(priceRange[0] / 1000000) * 100}% - 8px)`, 
                        top: '0px', // Slider track'in tam üstünde
                        transform: 'translateY(-50%)', // Dikey olarak ortala
                        pointerEvents: 'auto', // Tıklanabilir yap
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        // Min slider'ı aktif et
                        if (minSliderRef.current) {
                          minSliderRef.current.style.zIndex = '35';
                          minSliderRef.current.style.pointerEvents = 'auto';
                        }
                        if (maxSliderRef.current) {
                          maxSliderRef.current.style.zIndex = '20';
                          maxSliderRef.current.style.pointerEvents = 'none';
                        }
                        // Mouse move ve up event'lerini dinle
                        const handleMouseMove = (e: MouseEvent) => {
                          if (minSliderRef.current) {
                            const rect = minSliderRef.current.getBoundingClientRect();
                            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                            const newValue = Math.min(Math.round(percent * 1000000), priceRange[1] - 10000);
                            minSliderRef.current.value = newValue.toString();
                            setPriceRange([newValue, priceRange[1]]);
                          }
                        };
                        const handleMouseUp = () => {
                          if (minSliderRef.current) {
                            minSliderRef.current.style.zIndex = '20';
                            minSliderRef.current.style.pointerEvents = 'none';
                          }
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                    
                    {/* Visual Max Thumb - Tıklanabilir */}
                    <div
                      className="absolute w-4 h-4 bg-primary-700 rounded-full shadow-soft cursor-grab active:cursor-grabbing z-40"
                      style={{ 
                        left: `calc(${(priceRange[1] / 1000000) * 100}% - 8px)`, 
                        top: '0px', // Slider track'in tam üstünde
                        transform: 'translateY(-50%)', // Dikey olarak ortala
                        pointerEvents: 'auto', // Tıklanabilir yap
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        // Max slider'ı aktif et
                        if (maxSliderRef.current) {
                          maxSliderRef.current.style.zIndex = '35';
                          maxSliderRef.current.style.pointerEvents = 'auto';
                        }
                        if (minSliderRef.current) {
                          minSliderRef.current.style.zIndex = '20';
                          minSliderRef.current.style.pointerEvents = 'none';
                        }
                        // Mouse move ve up event'lerini dinle
                        const handleMouseMove = (e: MouseEvent) => {
                          if (maxSliderRef.current) {
                            const rect = maxSliderRef.current.getBoundingClientRect();
                            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                            const newValue = Math.max(Math.round(percent * 1000000), priceRange[0] + 10000);
                            maxSliderRef.current.value = newValue.toString();
                            setPriceRange([priceRange[0], newValue]);
                          }
                        };
                        const handleMouseUp = () => {
                          if (maxSliderRef.current) {
                            maxSliderRef.current.style.zIndex = '30';
                            maxSliderRef.current.style.pointerEvents = 'none';
                          }
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-neutral-500 mt-4">
                    <span>€0</span>
                    <span>€1,000,000+</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full md:w-auto px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg shadow-soft btn-primary"
            >
              <span className="btn-content">Search Properties</span>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-neutral-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-neutral-600">
              Handpicked luxury properties in prime locations
            </p>
          </div>
          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-card shadow-soft animate-pulse">
                  <div className="h-64 bg-neutral-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-neutral-200 rounded"></div>
                    <div className="h-4 bg-neutral-200 rounded"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-card shadow-soft overflow-hidden group property-card hero-fade-in hero-fade-in-delay-3"
                >
                  <div className="h-64 relative overflow-hidden">
                    {property.images.length > 0 ? (
                      <img
                        src={property.images[0].thumbnailUrl || property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover property-card-image"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400"></div>
                    )}
                    <div className="absolute top-4 right-4 bg-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-heading font-bold text-primary-700">
                        €{property.price.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {property.location.district}
                      {property.location.neighborhood && `, ${property.location.neighborhood}`}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      {property.bedrooms && <span>{property.bedrooms} bed</span>}
                      {property.bathrooms && <span>{property.bathrooms} bath</span>}
                      {property.area && <span>{property.area} m²</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">No featured properties available at the moment.</p>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-block px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg transition-colors shadow-soft"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Verified Listings</h3>
              <p className="text-sm text-neutral-600">All properties are verified by our expert team</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Expert Agents</h3>
              <p className="text-sm text-neutral-600">Professional real estate agents at your service</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Best Prices</h3>
              <p className="text-sm text-neutral-600">Competitive pricing with transparent fees</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-neutral-600">Round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
