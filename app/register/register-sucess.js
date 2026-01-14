"use client";

import { motion } from "framer-motion";
import { CheckCircle, Plane } from "lucide-react";
import { Button } from "../_component/_ui/button";

export function RegisterSuccess({ onLoginClick, countdown = 5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold">Registration Successful!</h2>

      <div className="mt-4 space-y-3">
        <p className="text-muted-foreground">
          Your account has been created successfully.
        </p>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <span className="font-medium">
              Ready to book your first flight?
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Login to start searching and booking flights
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button onClick={onLoginClick} className="w-full">
          Go to Login
        </Button>

        <p className="text-xs text-muted-foreground">
          Auto-redirect in <span className="font-bold">{countdown}</span>{" "}
          seconds
        </p>
      </div>
    </motion.div>
  );
}
