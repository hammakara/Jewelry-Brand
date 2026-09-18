import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { seedPrismaData } from '../lib/seed';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.storeSettingsModel.findUnique({
      where: { id: 1 },
    });
    if (settings) {
      res.json(settings.data);
    } else {
      res.status(404).json({ error: 'Settings not found' });
    }
  } catch (err: any) {
    console.error('Prisma Error fetching settings:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/settings', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    const newSettings = req.body;
    const settings = await prisma.storeSettingsModel.upsert({
      where: { id: 1 },
      update: { data: newSettings },
      create: { id: 1, data: newSettings },
    });
    res.json(settings.data);
  } catch (err: any) {
    console.error('Prisma Error updating settings:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/seed', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
  try {
    await seedPrismaData();
    res.json({ success: true, message: 'Prisma database reset and re-seeded successfully.' });
  } catch (err: any) {
    console.error('Prisma Error seeding database:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;