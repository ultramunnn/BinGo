import * as UserModel from "../models/user.model";
import * as BlacklistModel from "../models/token-blacklist.model";
import * as ResetTokenModel from "../models/reset-token.model";
import { generateToken } from "./jwt.service";
import { sendPasswordResetEmail } from "./email.service";
import type { UserUpdateInput } from "../models/user.model";

export class AuthError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export async function register(email: string, password: string, full_name?: string) {
  if (await UserModel.emailExists(email)) {
    throw new AuthError(409, "Email already registered");
  }

  const user = await UserModel.create({ email, password, full_name });
  if (!user) {
    throw new AuthError(500, "Failed to create user");
  }

  const token = generateToken({ id: user.id, email: user.email });
  return { token, user };
}

export async function login(email: string, password: string) {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AuthError(401, "Invalid email or password");
  }

  const valid = await UserModel.verifyPassword(user, password);
  if (!valid) {
    throw new AuthError(401, "Invalid email or password");
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