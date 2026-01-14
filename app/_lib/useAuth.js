// use AUTH
"use client";

import { useContext } from "react";
import { AuthContext } from "../_lib/auth-Context";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
