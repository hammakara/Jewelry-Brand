import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import {
  JWT_SECRET,
  TOKEN_EXPIRY,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_NAME,
  ADMIN_PHONE,
  ADMIN_AVATAR_URL,
} from '../config';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

if (!JWT_SECRET) {
  console.warn('[Auth] JWT_SECRET not set. Please configure it in your .env file.');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function ensureDefaultAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({ where: { id: 'usr-admin-director' } });

    if (existingAdmin) {
      console.log(`[Auth] Default Super Admin already exists: ${ADMIN_EMAIL}`);
      return;
    }

    if (!ADMIN_PASSWORD) {
      console.warn('[Auth] ADMIN_PASSWORD not set. Skipping default admin creation. Set it in .env to create the initial admin.');
      return;
    }

    const hashedPassword = await hashPassword(ADMIN_PASSWORD);

    await prisma.user.create({
      data: {
        id: 'usr-admin-director',
        email: ADMIN_EMAIL,
        passwordHash: hashedPassword,
        name: ADMIN_NAME,
        phone: ADMIN_PHONE,
        role: 'ADMIN',
        avatarUrl: ADMIN_AVATAR_URL,
      },
    });

    console.log(`[Auth] Default Super Admin created: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('[Auth] Error ensuring default admin:', error);
  }
}