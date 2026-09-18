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

/**
 * Extract a Cloudinary public_id from a hosted image URL.
 * Accepts delivery URLs like:
 *   /<cloud>/image/upload/v1234/<folder>/<public_id>.png
 *   /<cloud>/image/upload/f_auto,q_auto/v1234/<folder>/<public_id>.png
 */
export function publicIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('res.cloudinary.com')) return null;

    const segments = parsed.pathname.split('/').filter(Boolean);
    const uploadIdx = segments.findIndex((s) => s === 'upload');
    if (uploadIdx === -1 || uploadIdx === segments.length - 1) return null;

    let rest = segments.slice(uploadIdx + 1);
    const versionIdx = rest.findIndex((s) => /^v\d+$/.test(s));
    if (versionIdx !== -1) {
      rest = rest.slice(versionIdx + 1);
    }
    rest = rest.filter((s) => !s.includes(','));

    const assetPath = rest.join('/');
    if (!assetPath) return null;

    return assetPath.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

/**
 * Delete an image from Cloudinary by its hosted URL.
 * Returns false if the asset no longer exists (already deleted).
 */
export async function deleteImageByUrl(url: string): Promise<boolean> {
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_* env vars to enable image deletion.');
  }

  const publicId = publicIdFromUrl(url);
  if (!publicId) {
    throw new Error('Invalid Cloudinary image URL.');
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  return result.result === 'ok' || result.result === 'not found';
}