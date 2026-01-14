"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "../_component/_ui/button";
import { Input } from "../_component/_ui/input";
import { Label } from "../_component/_ui/label";
import { useAuth } from "../_lib/useAuth";
import { useToast } from "../context/toast-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, user, isAuthenticated, loading } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔥 CRITICAL: Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("✅ User already logged in, redirecting...");
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/search");
      }
    }
  }, [isAuthenticated, loading, router, user]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      addToast("Login successful!", "success");

      router.push("/search");

      // Small delay then redirect
    } catch (err) {
      const errorMessage = err.message || "Invalid email or password";
      setError(errorMessage);
      addToast(errorMessage, "error");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md px-4"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Plane className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your SkyBook account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password
                </Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* <div className="mt-6 rounded-lg bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
            <p className="font-medium">Demo Accounts:</p>
            <p className="mt-1">
              User: user@example.com / Password: password123
            </p>
            <p className="mt-1">
              Admin: admin@example.com / Password: admin123
            </p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}
