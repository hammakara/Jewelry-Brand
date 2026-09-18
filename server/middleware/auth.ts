import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../lib/auth';

export type { TokenPayload } from '../lib/auth';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

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