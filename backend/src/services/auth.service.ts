import * as UserModel from "../models/user.model";
import * as BlacklistModel from "../models/token-blacklist.model";
import * as ResetTokenModel from "../models/reset-token.model";
import * as EmailVerificationModel from "../models/email-verification.model";
import { generateToken } from "./jwt.service";
import { sendPasswordResetEmail, sendEmailVerificationEmail } from "./email.service";
import type { UserUpdateInput } from "../models/user.model";
import crypto from "crypto";

export class AuthError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export async function register(email: string, password: string, full_name?: string) {
  if (await UserModel.emailExists(email)) {
    throw new AuthError(409, "Email sudah terdaftar");
  }

  const user = await UserModel.create({ email, password, full_name });
  if (!user) {
    throw new AuthError(500, "Gagal membuat akun");
  }

  const verifyToken = await EmailVerificationModel.create(user.id);
  if (!verifyToken) {
    throw new AuthError(500, "Gagal menghasilkan token verifikasi");
  }

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
  await sendEmailVerificationEmail(user.email, verifyLink);

  return { requiresVerification: true, user };
}

export async function login(email: string, password: string) {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AuthError(401, "Email atau password salah");
  }

  const valid = await UserModel.verifyPassword(user, password);
  if (!valid) {
    throw new AuthError(401, "Email atau password salah");
  }

  if (!user.is_verified) {
    throw new AuthError(403, "Email Anda belum diverifikasi. Silakan periksa kotak masuk email Anda.");
  }

  const sanitized = await UserModel.getSanitized(user.id);
  const token = generateToken({ id: user.id, email: user.email });
  return { token, user: sanitized };
}

export async function logout(token: string) {
  await BlacklistModel.addToBlacklist(token);
}

export async function requestPasswordReset(email: string) {
  const user = await UserModel.findByEmail(email);
  if (!user) return; // security: always return success

  const resetToken = await ResetTokenModel.create(user.id);
  if (!resetToken) {
    throw new AuthError(500, "Failed to generate reset token");
  }

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user.email, resetLink);
}

export async function changePassword(token: string, newPassword: string) {
  const userId = await ResetTokenModel.validate(token);
  if (!userId) {
    throw new AuthError(400, "Invalid or expired token");
  }

  if (!(await UserModel.existsById(userId))) {
    throw new AuthError(404, "User not found");
  }

  await UserModel.updatePassword(userId, newPassword);
  await ResetTokenModel.markUsed(token);
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await UserModel.findByEmail(
    (await UserModel.getSanitized(userId))?.email || ""
  );
  if (!user) {
    throw new AuthError(404, "User not found");
  }

  const valid = await UserModel.verifyPassword(user, currentPassword);
  if (!valid) {
    throw new AuthError(401, "Password saat ini salah");
  }

  await UserModel.updatePassword(userId, newPassword);
}

export async function getProfile(userId: string) {
  const user = await UserModel.getSanitized(userId);
  if (!user) {
    throw new AuthError(404, "User not found");
  }
  return user;
}

export async function updateProfile(userId: string, updates: UserUpdateInput) {
  const user = await UserModel.updateProfile(userId, updates);
  if (!user) {
    throw new AuthError(404, "User not found");
  }
  return user;
}

export async function googleLogin(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload: any = await response.json();

  if (!response.ok || !payload.email) {
    throw new AuthError(400, "Google authentication failed or invalid token");
  }

  let user = await UserModel.findByEmail(payload.email);

  if (!user) {
    // Create new user with random password (Google logins are pre-verified)
    const randomPassword = crypto.randomBytes(16).toString("hex");
    const createdUser = await UserModel.create({
      email: payload.email,
      password: randomPassword,
      full_name: payload.name || "Google User",
      is_verified: true,
    });

    if (!createdUser) {
      throw new AuthError(500, "Failed to create account for Google login");
    }

    user = await UserModel.findByEmail(payload.email);
    if (!user) {
      throw new AuthError(500, "Failed to process new Google user");
    }
  }

  // Update photo url if missing
  if (!user.photo_url && payload.picture) {
    await UserModel.updateProfile(user.id, { photo_url: payload.picture });
  }

  const sanitized = await UserModel.getSanitized(user.id);
  const token = generateToken({ id: user.id, email: user.email });
  return { token, user: sanitized };
}

export async function verifyEmail(token: string) {
  const userId = await EmailVerificationModel.validate(token);
  if (!userId) {
    throw new AuthError(400, "Token verifikasi tidak valid atau telah kedaluwarsa");
  }

  await UserModel.verifyEmail(userId);
  await EmailVerificationModel.markVerified(token);
}

export async function resendVerificationEmail(email: string) {
  const user = await UserModel.findByEmail(email);
  if (!user) return; // Silent return for security

  if (user.is_verified) {
    throw new AuthError(400, "Email Anda sudah terverifikasi");
  }

  const verifyToken = await EmailVerificationModel.create(user.id);
  if (!verifyToken) {
    throw new AuthError(500, "Gagal menghasilkan token verifikasi");
  }

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
  await sendEmailVerificationEmail(user.email, verifyLink);
}