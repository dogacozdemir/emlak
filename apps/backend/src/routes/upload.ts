import { Router } from 'express';
import { authenticate, requireAdminOrAgent } from '../middleware/auth';
import { generateUploadSignature } from '../lib/cloudinary';

const router = Router();

/**
 * GET /api/upload/signature
 * Get Cloudinary upload signature for client-side uploads
 * Requires authentication (admin or agent)
 */
router.get('/signature', authenticate, requireAdminOrAgent, (req, res) => {
  try {
    const folder = (req.query.folder as string) || 'emlak/properties';
    const signature = generateUploadSignature(folder);

    res.json({
      success: true,
      data: {
        ...signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
      },
    });
  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate upload signature',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

