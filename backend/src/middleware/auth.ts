import { Request, Response, NextFunction } from 'express';
import TokenModel from '../models/token.model';
import { AuthRequest, JWTPayload } from '../types/auth';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Check blacklist
  if (await TokenModel.isBlacklisted(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  // Verify JWT
  const decoded = TokenModel.verifyJWT(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};