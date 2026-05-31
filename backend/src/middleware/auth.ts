import { Response, NextFunction } from "express";
import { isBlacklisted } from "../models/token-blacklist.model";
import { verifyToken } from "../services/jwt.service";
import { AuthRequest } from "../types/auth";

/**
 * Optional auth — sets req.user if valid token present, but doesn't fail if missing.
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (!(await isBlacklisted(token))) {
      const decoded = verifyToken(token);
      if (decoded) req.user = decoded;
    }
  }
  next();
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (await isBlacklisted(token)) {
    return res.status(401).json({ error: "Token has been revoked" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = decoded;
  next();
};
