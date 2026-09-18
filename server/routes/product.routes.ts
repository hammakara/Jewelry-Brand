import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      nameKhmer: p.nameKhmer,
      categoryId: p.categoryId,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      description: p.description || '',
      descriptionKhmer: p.descriptionKhmer || '',
      pearlType: p.pearlType,
      color: p.color,
      size: p.size,
      material: p.material,
      lustre: p.lustre,
      availability: p.availability as any,
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestseller,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      createdAt: p.createdAt.toISOString(),
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error('Prisma Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    const {
      id, sku, name, nameKhmer, categoryId, price, originalPrice,
      description, descriptionKhmer, pearlType, color, size,
      material, lustre, availability, images, isFeatured, isBestSeller,
      rating, reviewCount,
    } = req.body;

    const prodId = id || `prod-${Date.now()}`;
    const product = await prisma.product.create({
      data: {
        id: prodId,
        sku: sku || `PRL-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        nameKhmer: nameKhmer || name,
        categoryId,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        description: description || '',
        descriptionKhmer: descriptionKhmer || '',
        pearlType: pearlType || 'Freshwater',
        color: color || 'Classic White',
        size: size || '8.0 mm',
        material: material || '925 Sterling Silver',
        lustre: lustre || 'AAA Grade',
        availability: availability || 'in_stock',
        images: Array.isArray(images) ? images : [],
        isFeatured: !!isFeatured,
        isBestseller: !!isBestSeller,
        rating: rating ? Number(rating) : 5.0,
        reviewCount: reviewCount ? Number(reviewCount) : 0,
      },
    });

    res.status(201).json({
      id: product.id,
      sku: product.sku,
      name: product.name,
      nameKhmer: product.nameKhmer,
      categoryId: product.categoryId,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      description: product.description || '',
      descriptionKhmer: product.descriptionKhmer || '',
      pearlType: product.pearlType,
      color: product.color,
      size: product.size,
      material: product.material,
      lustre: product.lustre,
      availability: product.availability,
      images: product.images,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestseller,
      rating: Number(product.rating),
      reviewCount: product.reviewCount,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err: any) {
    console.error('Prisma Error creating product:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const {
      sku, name, nameKhmer, categoryId, price, originalPrice,
      description, descriptionKhmer, pearlType, color, size,
      material, lustre, availability, images, isFeatured, isBestSeller,
      rating, reviewCount,
    } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(sku !== undefined && { sku }),
        ...(name !== undefined && { name }),
        ...(nameKhmer !== undefined && { nameKhmer }),
        ...(categoryId !== undefined && { categoryId }),
        ...(price !== undefined && { price: Number(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number(originalPrice) : null }),
        ...(description !== undefined && { description }),
        ...(descriptionKhmer !== undefined && { descriptionKhmer }),
        ...(pearlType !== undefined && { pearlType }),
        ...(color !== undefined && { color }),
        ...(size !== undefined && { size }),
        ...(material !== undefined && { material }),
        ...(lustre !== undefined && { lustre }),
        ...(availability !== undefined && { availability }),
        ...(images !== undefined && { images }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isBestSeller !== undefined && { isBestseller: isBestSeller }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(reviewCount !== undefined && { reviewCount: Number(reviewCount) }),
      },
    });

    res.json({
      id: product.id,
      sku: product.sku,
      name: product.name,
      nameKhmer: product.nameKhmer,
      categoryId: product.categoryId,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      description: product.description || '',
      descriptionKhmer: product.descriptionKhmer || '',
      pearlType: product.pearlType,
      color: product.color,
      size: product.size,
      material: product.material,
      lustre: product.lustre,
      availability: product.availability,
      images: product.images,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestseller,
      rating: Number(product.rating),
      reviewCount: product.reviewCount,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err: any) {
    console.error('Prisma Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    console.error('Prisma Error deleting product:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;