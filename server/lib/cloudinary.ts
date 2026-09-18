import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_FOLDER,
} from '../config';

const isConfigured =
  Boolean(CLOUDINARY_CLOUD_NAME) &&
  Boolean(CLOUDINARY_API_KEY) &&
  Boolean(CLOUDINARY_API_SECRET);

if (!isConfigured) {
  console.warn(
    '[Cloudinary] CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET not set. Product image uploads will be disabled.'
  );
}

if (isConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export function isCloudinaryConfigured(): boolean {
  return isConfigured;
}

/**
 * Upload a base64 data URL (e.g. "data:image/png;base64,...") to Cloudinary
 * and return the secure HTTPS URL of the uploaded asset.
 */
export async function uploadImage(dataUrl: string, options: { publicId?: string } = {}): Promise<string> {
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_* env vars to enable image uploads.');
  }

  if (!/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(dataUrl)) {
    throw new Error('Invalid image data. Expected a base64 data URL (data:image/...,;base64,...).');
  }

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: CLOUDINARY_UPLOAD_FOLDER,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    ...(options.publicId ? { public_id: options.publicId } : {}),
  });

  return result.secure_url;
}