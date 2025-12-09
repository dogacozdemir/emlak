import prisma from '../lib/prisma';
import { PropertyType } from '@prisma/client';
import { deleteImage } from '../lib/cloudinary';

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  furnished: boolean;
  available: boolean;
  featured: boolean;
  userId: string;
  locationId: string;
  images?: Array<{
    url: string;
    publicId: string;
    thumbnailUrl?: string;
    order: number;
    isPrimary: boolean;
  }>;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: string;
}

/**
 * Create a new property
 */
export async function createProperty(data: CreatePropertyData) {
  const property = await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      area: data.area ?? null,
      furnished: data.furnished,
      available: data.available,
      featured: data.featured,
      userId: data.userId,
      locationId: data.locationId,
      images: data.images
        ? {
            create: data.images.map((img) => ({
              url: img.url,
              publicId: img.publicId,
              thumbnailUrl: img.thumbnailUrl || null,
              order: img.order,
              isPrimary: img.isPrimary,
            })),
          }
        : undefined,
    },
    include: {
      location: true,
      images: {
        orderBy: {
          order: 'asc',
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return property;
}

/**
 * Update a property
 */
export async function updateProperty(data: UpdatePropertyData) {
  const { id, images, ...updateData } = data;

  // If images are provided, replace all existing images
  if (images) {
    // Get existing images to delete from Cloudinary
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: { images: true },
    });

    if (existingProperty) {
      // Delete old images from Cloudinary
      for (const image of existingProperty.images) {
        await deleteImage(image.publicId);
      }

      // Delete old images from database
      await prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      });
    }

    // Create new images
    await prisma.propertyImage.createMany({
      data: images.map((img) => ({
        propertyId: id,
        url: img.url,
        publicId: img.publicId,
        thumbnailUrl: img.thumbnailUrl || null,
        order: img.order,
        isPrimary: img.isPrimary,
      })),
    });
  }

  const property = await prisma.property.update({
    where: { id },
    data: updateData,
    include: {
      location: true,
      images: {
        orderBy: {
          order: 'asc',
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return property;
}

/**
 * Delete a property
 */
export async function deleteProperty(id: string) {
  // Get property with images
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!property) {
    throw new Error('Property not found');
  }

  // Delete images from Cloudinary
  for (const image of property.images) {
    await deleteImage(image.publicId);
  }

  // Delete property (cascade will delete images from DB)
  await prisma.property.delete({
    where: { id },
  });

  return { success: true };
}

