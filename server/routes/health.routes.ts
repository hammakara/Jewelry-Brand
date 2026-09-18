import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const [nowResult, productCount, userCount] = await Promise.all([
      prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`,
      prisma.product.count(),
      prisma.user.count(),
    ]);
    res.json({
      status: 'ok',
      orm: 'Prisma Client',
      database: 'Neon PostgreSQL',
      authentication: 'Full JWT + BCrypt + RBAC',
      connected: true,
      serverTime: nowResult[0]?.now || new Date(),
      productCount,
      userCount,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      orm: 'Prisma Client',
      database: 'Neon PostgreSQL',
      connected: false,
      error: err.message,
    });
  }
});

export default router;