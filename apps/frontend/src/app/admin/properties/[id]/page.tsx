'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImageUpload, { UploadedImage } from '@/components/ImageUpload';
import api from '@/lib/api';

interface Location {
  id: string;
  district: string;
  neighborhood: string | null;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'APARTMENT',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: false,
    available: true,
    featured: false,
    locationId: '',
  });
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
    fetchProperty();
  }, [propertyId]);

  const fetchLocations = async () => {
    // Simplified for Sprint 3
    const districts = ['Famagusta', 'Kyrenia', 'Nicosia'];
    setLocations(
      districts.map((d, i) => ({
        id: `temp-${i}`,
        district: d,
        neighborhood: null,
      }))
    );
  };

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get<{
        success: boolean;
        data: {
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
          locationId: string;
          images: Array<{
            url: string;
            publicId: string;
            thumbnailUrl: string | null;
            order: number;
            isPrimary: boolean;
          }>;
        };
      }>(`/properties/${propertyId}`);

      const property = response.data.data;
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price.toString(),
        propertyType: property.propertyType,
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area?.toString() || '',
        furnished: property.furnished,
        available: property.available,
        featured: property.featured,
        locationId: property.locationId,
      });

      setImages(
        property.images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          thumbnailUrl: img.thumbnailUrl || img.url,
          order: img.order,
          isPrimary: img.isPrimary,
        }))
      );
    } catch (err) {
      setError('Failed to load property');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setSaving(true);

    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        images: images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          thumbnailUrl: img.thumbnailUrl,
          order: img.order,
          isPrimary: img.isPrimary,
        })),
      };

      await api.put(`/properties/${propertyId}`, propertyData);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update property');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-neutral-600">Loading property...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
              ← Back to Admin Panel
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900">Edit Property</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Price (€) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Property Type *
                </label>
                <select
                  required
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="HOUSE">House</option>
                  <option value="STUDIO">Studio</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="LAND">Land</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  District *
                </label>
                <select
                  required
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select district</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Area (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-neutral-700">Furnished</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-neutral-700">Available</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-neutral-700">Featured</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Images
              </label>
              <ImageUpload images={images} onChange={setImages} maxImages={10} />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin"
                className="bg-neutral-200 text-neutral-700 px-6 py-2 rounded-lg hover:bg-neutral-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

