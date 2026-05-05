import { Request, Response } from "express";
import UserModel from "../models/user.model";
import TokenModel from "../models/token.model";
import { AuthRequest } from "../types/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Cek apakah email sudah terdaftar
    const emailExists = await UserModel.emailExists(email);
    if (emailExists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Buat user baru
    const newUser = await UserModel.create({ email, password, full_name });
    if (!newUser) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Generate JWT
    const token = TokenModel.generateJWT({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Cari user berdasarkan email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verifikasi password
    const isValid = await UserModel.verifyPassword(user, password);
    console.log("Password valid:", isValid);

    if (!isValid) {
      console.log(" Password mismatch");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = TokenModel.generateJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Ambil data user tanpa password
    const sanitizedUser = await UserModel.getSanitizedUser(user.id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // Cari user
    const user = await UserModel.findByEmail(email);

    // Security: tetap return success meskipun email tidak ditemukan
    if (!user) {
      return res.json({
        success: true,
        message: "If email exists, reset link will be sent to your inbox",
      });
    }

    // Buat reset token
    const resetToken = await TokenModel.createResetToken(user.id);

    if (!resetToken) {
      return res.status(500).json({ error: "Failed to generate reset token" });
    }

    // TODO: Kirim email dengan link reset password
    // Link: https://frontend.com/reset-password?token=${resetToken}
    console.log(`Reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: "If email exists, reset link will be sent to your inbox",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
      await TokenModel.addToBlacklist(token);
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Additional endpoint: Change password (after reset)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({ error: "Token and new password required" });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter" });
    }

    // Validate reset token
    const userId = await TokenModel.validateResetToken(token);
    if (!userId) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Update password
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await UserModel.update(userId, { password_hash: hashedPassword });
    await TokenModel.markResetTokenUsed(token);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current user profile
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.getSanitizedUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
