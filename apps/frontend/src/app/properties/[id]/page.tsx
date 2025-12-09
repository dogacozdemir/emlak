'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import ImageGallery from '@/components/ImageGallery';
import SimilarProperties from '@/components/SimilarProperties';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Property {
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
    address: string | null;
  };
  images: Array<{
    url: string;
    thumbnailUrl: string | null;
    order: number;
    isPrimary: boolean;
  }>;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const propertyId = params.id as string;
  const { isAuthenticated } = useAuthStore();

  const [property, setProperty] = useState<Property | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchProperty();
    fetchAllProperties();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: Property }>(
        `/properties/${propertyId}`
      );
      setProperty(response.data.data);
      setError(null);
      
      // Update page metadata for SEO
      if (response.data.data) {
        updatePageMetadata(response.data.data);
      }
    } catch (err) {
      setError('Failed to load property');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProperties = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Property[] }>('/properties');
      setAllProperties(response.data.data);
    } catch (err) {
      console.error('Failed to fetch properties for similar section:', err);
    }
  };

  const updatePageMetadata = (prop: Property) => {
    // Update document title
    document.title = `${prop.title} - €${prop.price.toLocaleString()} | KKTC Emlak`;

    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `${prop.title} in ${prop.location.district}. ${prop.description.substring(0, 150)}...`
      );
    }

    // OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', prop.title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.setAttribute('content', prop.title);
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', prop.description.substring(0, 200));
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.setAttribute('content', prop.description.substring(0, 200));
      document.head.appendChild(meta);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    const imageUrl = prop.images.find((img) => img.isPrimary)?.url || prop.images[0]?.url;
    if (ogImage && imageUrl) {
      ogImage.setAttribute('content', imageUrl);
    } else if (imageUrl) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', imageUrl);
      document.head.appendChild(meta);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (ogUrl) {
      ogUrl.setAttribute('content', currentUrl);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      meta.setAttribute('content', currentUrl);
      document.head.appendChild(meta);
    }

    // Twitter Card tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'twitter:card');
      meta.setAttribute('content', 'summary_large_image');
      document.head.appendChild(meta);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = property ? `${property.title} - €${property.price.toLocaleString()}` : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: text,
          text: property?.description.substring(0, 100),
          url: url,
        });
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading property...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Property Not Found</h1>
            <Link href="/properties" className="text-primary-600 hover:text-primary-700">
              ← Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/properties"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Properties
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="p-6">
            <ImageGallery images={property.images} title={property.title} />
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{property.title}</h1>
                <p className="text-lg text-neutral-600">
                  {property.location.district}
                  {property.location.neighborhood && `, ${property.location.neighborhood}`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  €{property.price.toLocaleString()}
                </div>
                {property.featured && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              {property.bedrooms && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <span className="font-medium">{property.bedrooms}</span>
                  <span>Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <span className="font-medium">{property.bathrooms}</span>
                  <span>Bathrooms</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <span className="font-medium">{property.area} m²</span>
                </div>
              )}
              {property.furnished && (
                <div className="px-2 py-1 bg-neutral-100 text-neutral-700 text-sm rounded">
                  Furnished
                </div>
              )}
              <div
                className={`px-2 py-1 text-sm rounded ${
                  property.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {property.available ? 'Available' : 'Sold'}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Description</h2>
              <p className="text-neutral-700 whitespace-pre-line">{property.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-600">Type:</span>
                  <span className="ml-2 font-medium">{property.propertyType}</span>
                </div>
                {property.location.address && (
                  <div>
                    <span className="text-neutral-600">Address:</span>
                    <span className="ml-2 font-medium">{property.location.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-2">Contact Agent</h3>
              <p className="text-neutral-700 mb-2">{property.user.name}</p>
              <p className="text-neutral-600 text-sm">{property.user.email}</p>
              {property.user.phone && (
                <p className="text-neutral-600 text-sm">{property.user.phone}</p>
              )}
            </div>

            {property.available && (
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 min-w-[200px] bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {isAuthenticated ? 'Book Viewing Appointment' : 'Login to Book Viewing'}
                </button>
                <a
                  href={`https://wa.me/905331234567?text=Hello, I'm interested in ${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  WhatsApp
                </a>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          propertyId={property.id}
          propertyTitle={property.title}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            alert('Booking request submitted! You will receive a confirmation email.');
            fetchProperty();
          }}
        />
      )}

      {property && allProperties.length > 0 && (
        <SimilarProperties
          currentProperty={{
            id: property.id,
            propertyType: property.propertyType,
            district: property.location.district,
            price: property.price,
          }}
          properties={allProperties}
        />
      )}
    </div>
  );
}

