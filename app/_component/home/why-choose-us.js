"use client";

import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Bank-grade encryption protects your payment information at all times.",
  },
  {
    icon: Clock,
    title: "Reliable Bookings",
    description:
      "Real-time availability and instant confirmation for every booking.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees. What you see is what you pay, always.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our customer support team is available around the clock to assist you.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Why Choose SkyBook</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We make flight booking simple, secure, and stress-free
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-secondary/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
