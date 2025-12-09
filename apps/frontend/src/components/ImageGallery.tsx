'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    thumbnailUrl: string | null;
    order: number;
    isPrimary: boolean;
  }>;
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-400">
        No Images
      </div>
    );
  }

  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const otherImages = images.filter((img) => img !== primaryImage).slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="md:col-span-2 cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={primaryImage.url}
            alt={title}
            className="w-full h-96 object-cover rounded-lg hover:opacity-90 transition-opacity"
          />
        </div>
        {otherImages.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => {
              setSelectedIndex(index + 1);
              setIsLightboxOpen(true);
            }}
          >
            <img
              src={image.thumbnailUrl || image.url}
              alt={`${title} ${index + 2}`}
              className="w-full h-48 object-cover rounded-lg hover:opacity-80 transition-opacity"
            />
          </div>
        ))}
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-neutral-300 z-10"
          >
            ×
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSlideDirection('left');
              setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
            }}
            className="absolute left-4 text-white text-4xl hover:text-neutral-300 z-10 transition-transform hover:scale-110"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSlideDirection('right');
              setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 text-white text-4xl hover:text-neutral-300 z-10 transition-transform hover:scale-110"
          >
            ›
          </button>
          <div onClick={(e) => e.stopPropagation()} className="relative overflow-hidden">
            <div 
              key={selectedIndex}
              className={`image-gallery-slide ${
                slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left'
              }`}
            >
              <img
                src={images[selectedIndex].url}
                alt={`${title} ${selectedIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

