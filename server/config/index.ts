export const JWT_SECRET = process.env.JWT_SECRET ?? '';
export const TOKEN_EXPIRY = '7d' as const;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pranith.luxury';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const ADMIN_NAME = 'Pranith Boutique Director';
export const ADMIN_PHONE = '+855 12 888 999';
export const ADMIN_AVATAR_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];
export const PORT = Number(process.env.PORT) || 3000;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? '';
export const CLOUDINARY_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER ?? 'pranith/products';
export const CLOUDINARY_MAX_IMAGE_MB = Number(process.env.CLOUDINARY_MAX_IMAGE_MB) || 8;