import 'dotenv/config';
import express from 'express';
import { initPrismaDatabase } from './lib/seed';
import { corsMiddleware } from './middleware/cors';
import apiRouter from './routes';

export const app = express();

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