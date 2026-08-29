import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { app } from './server/app';
import { initPrismaDatabase } from './server/prismaDb';

const PORT = 3000;

async function startServer() {
  // Initialize Prisma & Neon Database connection
  await initPrismaDatabase();

  // Vite middleware for local development / static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Live on http://localhost:${PORT} with Secure Prisma + JWT Authentication`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Prisma server:', err);
});
