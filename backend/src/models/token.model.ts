import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

class TokenModel {
  // Add token to blacklist
  async addToBlacklist(token: string): Promise<boolean> {
    try {
      const decoded = jwt.decode(token) as { exp: number };
      const expiresAt = new Date(decoded.exp * 1000);

      const { error } = await supabase.from("token_blacklist").insert({
        token,
        expires_at: expiresAt.toISOString(),
      });

      if (error) {
        console.error("Blacklist error:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error adding to blacklist:", error);
      return false;
    }
  }

  // Check if token is blacklisted
  async isBlacklisted(token: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("token_blacklist")
      .select("token")
      .eq("token", token)
      .single();

    if (error && error.code !== "PGRST116") return false;
    return !!data;
  }

  // Create password reset token
  async createResetToken(userId: string): Promise<string | null> {
    try {
      // Generate JWT as reset token
      const resetToken = jwt.sign(
        { id: userId, purpose: "password_reset" },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );

      const { error } = await supabase.from("password_resets").insert({
        user_id: userId,
        token: resetToken,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used: false,
      });

      if (error) {
        console.error("Error creating reset token:", error);
        return null;
      }

      return resetToken;
    } catch (error) {
      console.error("Error generating reset token:", error);
      return null;
    }
  }

  // Validate reset token
  async validateResetToken(token: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("password_resets")
      .select("user_id, used, expires_at")
      .eq("token", token)
      .single();

    if (error || !data) return null;

    // Check if token is expired or used
    if (data.used || new Date(data.expires_at) < new Date()) return null;

    return data.user_id;
  }

  // Mark reset token as used
  async markResetTokenUsed(token: string): Promise<boolean> {
    const { error } = await supabase
      .from("password_resets")
      .update({ used: true })
      .eq("token", token);

    if (error) return false;
    return true;
  }

  // Clean expired blacklisted tokens (call with cron job)
  async cleanExpiredTokens(): Promise<void> {
    const { error } = await supabase
      .from("token_blacklist")
      .delete()
      .lt("expires_at", new Date().toISOString());

    if (error) {
      console.error("Error cleaning expired tokens:", error);
    }
  }

  // Generate JWT for user
  generateJWT(user: { id: string; email: string; role: string }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
  }

  // Verify JWT token
  verifyJWT(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenModel();
