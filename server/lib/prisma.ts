import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.warn('[Prisma] DATABASE_URL not set. Please configure it in your .env file.');
}

export const prisma = new PrismaClient();