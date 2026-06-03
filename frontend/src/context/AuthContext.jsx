import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch {
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  }, []);

  const googleLogin = useCallback(async (accessToken) => {
    const data = await authService.googleLogin(accessToken);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    const data = await authService.register(email, password, fullName);
    if (data && data.token) {
      setUser(data.user);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    googleLogin,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
