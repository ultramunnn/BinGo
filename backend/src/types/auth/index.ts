import { Request } from "express";

export interface JWTPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}