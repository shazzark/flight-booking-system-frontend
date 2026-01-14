"use client";

import { motion } from "framer-motion";
import { Search, Ticket, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Flights",
    description:
      "Enter your travel details and browse available flights from top airlines.",
  },
  {
    icon: Ticket,
    title: "Book Your Seat",
    description:
      "Select your preferred flight and choose your seat for the journey.",
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description:
      "Complete your booking with our secure payment processing system.",
  },
  {
    icon: CheckCircle,
    title: "Get Confirmation",
    description:
      "Receive instant confirmation and e-ticket directly to your email.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Book your flight in four simple steps
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div
                className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-y-1/2 bg-border lg:block"
                style={{
                  display: index === steps.length - 1 ? "none" : undefined,
                }}
              />
              <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                Step {index + 1}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
