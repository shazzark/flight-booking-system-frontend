"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, ArrowRight } from "lucide-react";
import { Button } from "../_ui/button";
import { useAuth } from "../../_lib/useAuth";

export function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute right-0 top-0 -z-10 h-125 w-125 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-100 w-100 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
              <Plane className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Trusted by 100,000+ travelers
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Book Your Next
            <span className="block text-primary">Flight with Ease</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
          >
            Experience seamless flight booking with transparent pricing, secure
            payments, and instant confirmations. Your journey starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/search" className="flex items-center gap-2">
                Search Flights
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
              >
                <Link href="/register">Create Account</Link>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
