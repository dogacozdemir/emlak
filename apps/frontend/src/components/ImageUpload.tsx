'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getUploadSignature, uploadToCloudinary } from '@/lib/cloudinary';

export interface UploadedImage {
  url: string;
  publicId: string;
  thumbnailUrl: string;
  order: number;
  isPrimary: boolean;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const signature = await getUploadSignature('emlak/properties');
        const uploadPromises = acceptedFiles.map(async (file, index) => {
          const result = await uploadToCloudinary(file, signature);
          return {
            ...result,
            order: images.length + index,
            isPrimary: images.length === 0 && index === 0, // First image is primary
          };
        });

        const newImages = await Promise.all(uploadPromises);
        onChange([...images, ...newImages]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload images');
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: maxImages - images.length,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Update orders and primary flag
    const updatedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
      isPrimary: i === 0,
    }));
    onChange(updatedImages);
  };

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-neutral-300 hover:border-primary-400'
        } ${uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-neutral-600">Uploading...</p>
        ) : images.length >= maxImages ? (
          <p className="text-neutral-600">Maximum {maxImages} images reached</p>
        ) : (
          <div>
            <p className="text-neutral-600 mb-2">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
            </p>
            <p className="text-sm text-neutral-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.publicId} className="relative group">
              <img
                src={image.thumbnailUrl || image.url}
                alt={`Property ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              {image.isPrimary && (
                <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => setPrimary(index)}
                  disabled={image.isPrimary}
                  className="opacity-0 group-hover:opacity-100 bg-white text-neutral-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                >
                  Set Primary
                </button>
                <button
                  onClick={() => removeImage(index)}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

