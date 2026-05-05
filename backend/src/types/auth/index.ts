import { Request } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: "user" | "admin" | string;
}

export interface TokenPayload extends JWTPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}
