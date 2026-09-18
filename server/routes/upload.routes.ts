import { Router } from 'express';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { uploadImage, isCloudinaryConfigured } from '../lib/cloudinary';
import { CLOUDINARY_MAX_IMAGE_MB } from '../config';

const router = Router();

router.post('/upload', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Image uploads are disabled. Cloudinary is not configured on the server.',
        code: 'CLOUDINARY_NOT_CONFIGURED',
      });
    }

    const { dataUrl, fileName } = req.body;

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Missing image data. Send a base64 data URL in the "dataUrl" field.' });
    }

    if (!/^data:image\//i.test(dataUrl)) {
      return res.status(400).json({ error: 'Uploaded file must be an image (data:image/...).' });
    }

    const base64Body = dataUrl.split(',')[1] || '';
    const sizeMb = (base64Body.length * 3) / 4 / 1024 / 1024;
    if (sizeMb > CLOUDINARY_MAX_IMAGE_MB) {
      return res.status(413).json({
        error: `Image is too large (${sizeMb.toFixed(1)} MB). Maximum allowed is ${CLOUDINARY_MAX_IMAGE_MB} MB.`,
      });
    }

    const publicId = fileName
      ? `prod-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '').replace(/\.[^.]+$/, '')}`
      : undefined;

    const url = await uploadImage(dataUrl, { publicId });

    res.status(201).json({ success: true, url });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: err.message || 'Image upload failed.' });
  }
});

export default router;