"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";
import { Button } from "../_ui/button";
import { useAuth } from "../../_lib/useAuth";

export function CTASection() {
  const { user, isAuthenticated } = useAuth();
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div className="absolute left-0 top-0 -z-10 h-full w-full">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-3xl" />
          </div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <Plane className="h-8 w-8 text-primary-foreground" />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to Take Off?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join thousands of travelers who trust SkyBook for their flight
            bookings. Create an account today and start your journey.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!isAuthenticated && (
              <Button asChild size="lg" variant="secondary">
                <Link href="/register" className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/search">Search Flights</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
