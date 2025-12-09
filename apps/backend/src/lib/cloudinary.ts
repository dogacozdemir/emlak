import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate a signed upload preset for client-side uploads
 */
export function generateUploadSignature(folder?: string): {
  signature: string;
  timestamp: number;
  folder?: string;
} {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folderParam = folder ? `folder=${folder}&` : '';
  const stringToSign = `${folderParam}timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;

  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  return {
    signature,
    timestamp,
    folder: folder || undefined,
  };
}

/**
 * Upload image to Cloudinary (server-side)
 */
export async function uploadImage(
  filePath: string,
  folder: string = 'emlak/properties'
): Promise<{
  url: string;
  publicId: string;
  secureUrl: string;
}> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { format: 'webp' },
      ],
    });

    // Generate thumbnail
    const thumbnailUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 400, height: 300, crop: 'fill' },
        { quality: 'auto' },
        { format: 'webp' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      secureUrl: thumbnailUrl,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
    // Don't throw - allow deletion to continue even if Cloudinary fails
  }
}

export default cloudinary;

