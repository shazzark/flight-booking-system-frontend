"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "./apiService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Fetch current user on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // const login = async (credentials) => {
  //   const data = await authAPI.login(credentials);
  //   setUser(data.data.user);
  //   return data;
  // };
  // After successful login, force a state update
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem("token", data.token);
      // backend already returns user + sets cookie
      setUser(data.data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // Add the missing register function
  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const data = await authAPI.register({
        name,
        email,
        password,
        passwordConfirm: password,
      });

      // Registration successful, but don't auto-login
      console.log("✅ Registration successful:", data);

      // Return success without setting user
      return data;
    } catch (error) {
      console.log("❌ [AuthContext] ERROR in register:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // 1. Optimistically update UI
    setUser(null);

    // 2. Redirect immediately
    router.push("/login");

    // 3. Fire-and-forget API call
    authAPI.logout().catch((err) => {
      console.error("Logout request failed:", err);
      // No rollback — user stays logged out
    });
  };

  // In your existing authContext.js, you could add this:
  const canAccess = (requiredRole = null) => {
    if (!user) return false;
    if (!requiredRole) return true;
    return user.role === requiredRole;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register, // This was missing in your original code
    logout,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
