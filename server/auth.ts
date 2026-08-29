import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prismaDb';

const JWT_SECRET = process.env.JWT_SECRET || 'pranith_pearl_luxury_boutique_jwt_secret_key_2026_secure';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare raw password with hashed password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

// Middleware: Authenticate Bearer JWT
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'AUTH_TOKEN_MISSING',
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({
      error: 'Invalid or expired session token',
      code: 'AUTH_TOKEN_INVALID',
    });
  }

  req.user = payload;
  next();
}

// Middleware: Require specific roles (e.g., ADMIN, STAFF)
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Permission denied. Required role: ${allowedRoles.join(' or ')}`,
        code: 'FORBIDDEN',
      });
    }

    next();
  };
}

// Ensure at least one default super admin exists
export async function ensureDefaultAdmin() {
  try {
    const defaultEmail = 'admin@pranith.luxury';
    const defaultPassword = 'AdminPassword2026!';
    const defaultName = 'Pranith Boutique Director';
    
    const hashedPassword = await hashPassword(defaultPassword);

    await prisma.user.upsert({
      where: { id: 'usr-admin-director' },
      update: {
        email: defaultEmail,
        passwordHash: hashedPassword,
        name: defaultName,
        role: 'ADMIN',
      },
      create: {
        id: 'usr-admin-director',
        email: defaultEmail,
        passwordHash: hashedPassword,
        name: defaultName,
        phone: '+855 12 888 999',
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
    });

    console.log(`[Auth] Verified default Super Admin: ${defaultEmail} (${defaultPassword})`);
  } catch (error) {
    console.error('[Auth] Error ensuring default admin:', error);
  }
}
