import api from './api';

export interface UploadSignature {
  signature: string;
  timestamp: number;
  folder?: string;
  cloudName: string;
  apiKey: string;
  uploadPreset?: string;
}

/**
 * Get Cloudinary upload signature from backend
 */
export async function getUploadSignature(folder?: string): Promise<UploadSignature> {
  const response = await api.get<{ success: boolean; data: UploadSignature }>(
    `/upload/signature${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`
  );
  return response.data.data;
}

/**
 * Upload image directly to Cloudinary from client
 */
export async function uploadToCloudinary(
  file: File,
  signature: UploadSignature
): Promise<{
  url: string;
  publicId: string;
  secureUrl: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signature.apiKey);
  formData.append('timestamp', signature.timestamp.toString());
  formData.append('signature', signature.signature);
  if (signature.folder) {
    formData.append('folder', signature.folder);
  }
  if (signature.uploadPreset) {
    formData.append('upload_preset', signature.uploadPreset);
  }

  // Upload to Cloudinary
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`;
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();

  // Generate thumbnail URL
  const thumbnailUrl = `https://res.cloudinary.com/${signature.cloudName}/image/upload/w_400,h_300,c_fill,q_auto,f_webp/${data.public_id}`;

  return {
    url: data.secure_url,
    publicId: data.public_id,
    secureUrl: thumbnailUrl,
  };
}

