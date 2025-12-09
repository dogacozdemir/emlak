import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, requireAdminOrAgent } from '../middleware/auth';
import { createProperty, updateProperty, deleteProperty } from '../services/propertyService';
import { PropertyType } from '@prisma/client';

const router = Router();

// Validation schemas
const createPropertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  propertyType: z.nativeEnum(PropertyType),
  bedrooms: z.number().int().positive().nullable().optional(),
  bathrooms: z.number().int().positive().nullable().optional(),
  area: z.number().positive().nullable().optional(),
  furnished: z.boolean(),
  available: z.boolean(),
  featured: z.boolean(),
  locationId: z.string().min(1, 'Location ID is required'),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        thumbnailUrl: z.string().url().optional(),
        order: z.number().int().min(0),
        isPrimary: z.boolean(),
      })
    )
    .optional(),
});

const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string().min(1),
});

/**
 * GET /api/properties
 * Get all properties with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      district,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      available,
      featured,
      // Geo bounding box (for map viewport filtering)
      minLat,
      maxLat,
      minLng,
      maxLng,
    } = req.query;

    // Build where clause
    const where: any = {};

    // Location filters (district and/or geo bounding box)
    const locationFilters: any = {};
    if (district) {
      locationFilters.district = district as string;
    }

    // Geo bounding box filter (for map viewport)
    if (minLat && maxLat && minLng && maxLng) {
      locationFilters.lat = {
        gte: parseFloat(minLat as string),
        lte: parseFloat(maxLat as string),
      };
      locationFilters.lng = {
        gte: parseFloat(minLng as string),
        lte: parseFloat(maxLng as string),
      };
    }

    if (Object.keys(locationFilters).length > 0) {
      where.location = locationFilters;
    }

    if (propertyType) {
      where.propertyType = propertyType as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice as string);
      }
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms as string, 10);
    }

    if (available !== undefined) {
      where.available = available === 'true';
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        location: true,
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1, // Get primary image for list view
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
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: properties,
      count: properties.length,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/properties/:id
 * Get a single property by ID with full details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
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

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/properties
 * Create a new property (requires auth, admin or agent)
 */
router.post('/', authenticate, requireAdminOrAgent, async (req, res) => {
  try {
    const validatedData = createPropertySchema.parse({
      ...req.body,
      locationId: req.body.locationId,
    });

    const property = await createProperty({
      ...validatedData,
      userId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/properties/:id
 * Update a property (requires auth, admin or agent, must be owner or admin)
 */
router.put('/:id', authenticate, requireAdminOrAgent, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if property exists and user has permission
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Only admin or property owner can update
    if (req.user!.role !== 'ADMIN' && existingProperty.userId !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this property',
      });
    }

    const validatedData = updatePropertySchema.parse({
      ...req.body,
      id,
    });

    const property = await updateProperty(validatedData);

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/properties/:id
 * Delete a property (requires auth, admin or agent, must be owner or admin)
 */
router.delete('/:id', authenticate, requireAdminOrAgent, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if property exists and user has permission
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Only admin or property owner can delete
    if (req.user!.role !== 'ADMIN' && existingProperty.userId !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this property',
      });
    }

    await deleteProperty(id);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
