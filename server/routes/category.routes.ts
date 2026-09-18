import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(categories);
  } catch (err: any) {
    console.error('Prisma Error fetching categories:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/categories', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id, name, nameKhmer, slug, description, descriptionKhmer, image } = req.body;
    const catId = id || `cat-${Date.now()}`;
    const category = await prisma.category.create({
      data: {
        id: catId,
        name,
        nameKhmer: nameKhmer || name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description: description || '',
        descriptionKhmer: descriptionKhmer || '',
        image: image || '',
      },
    });
    res.status(201).json(category);
  } catch (err: any) {
    console.error('Prisma Error creating category:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/categories/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { name, nameKhmer, slug, description, descriptionKhmer, image } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(nameKhmer !== undefined && { nameKhmer }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(descriptionKhmer !== undefined && { descriptionKhmer }),
        ...(image !== undefined && { image }),
      },
    });
    res.json(category);
  } catch (err: any) {
    console.error('Prisma Error updating category:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/categories/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    console.error('Prisma Error deleting category:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;