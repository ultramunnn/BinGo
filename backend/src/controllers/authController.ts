import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";
import * as StorageService from "../services/storage.service";
import { AuthRequest } from "../types/auth";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, full_name } = req.body;
  const result = await AuthService.register(email, password, full_name);
  res.status(201).json({ success: true, message: "User registered successfully", ...result });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  res.json({ success: true, message: "Login successful", ...result });
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) await AuthService.logout(token);
  res.json({ success: true, message: "Logout successful" });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  await AuthService.requestPasswordReset(email);
  res.json({ success: true, message: "If email exists, reset link will be sent to your inbox" });
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token, new_password } = req.body;
  await AuthService.changePassword(token, new_password);
  res.json({ success: true, message: "Password changed successfully" });
};

export const updatePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { current_password, new_password } = req.body;
  await AuthService.updatePassword(req.user!.id, current_password, new_password);
  res.json({ success: true, message: "Password berhasil diperbarui" });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await AuthService.getProfile(req.user!.id);
  res.json({ success: true, user });
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { full_name, photo_url } = req.body;
  const user = await AuthService.updateProfile(req.user!.id, { full_name, photo_url });
  res.json({ success: true, message: "Profile updated", user });
};

export const uploadPhoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Photo file is required" });
  }

  const userId = req.user!.id;
  const photoUrl = await StorageService.uploadPhoto(userId, file.buffer, file.mimetype);
  if (!photoUrl) {
    return res.status(500).json({ error: "Failed to upload photo" });
  }

  const user = await AuthService.updateProfile(userId, { photo_url: photoUrl });
  res.json({ success: true, message: "Photo uploaded", user });
};
