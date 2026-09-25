import 'dotenv/config';
import express from 'express';
import { initPrismaDatabase } from './lib/seed';
import { corsMiddleware } from './middleware/cors';
import apiRouter from './routes';
import { CLOUDINARY_MAX_IMAGE_MB } from './config';

export const app = express();
const uploadJsonLimit = `${Math.ceil(CLOUDINARY_MAX_IMAGE_MB * 4 / 3) + 1}mb`;

app.use('/api/upload', express.json({ limit: uploadJsonLimit }));
app.use('/upload', express.json({ limit: uploadJsonLimit }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

let dbInitialized = false;
async function lazyInitDb() {
  if (!dbInitialized) {
    dbInitialized = true;
    try {
      await initPrismaDatabase();
    } catch (e) {
      console.error('[DB] Lazy init error:', e);
    }
  }
}

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    await lazyInitDb();
  }
  next();
});

app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;