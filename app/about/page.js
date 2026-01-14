"use client";

import { motion } from "framer-motion";
import { Target, Eye, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">About SkyBook</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Your trusted partner in seamless flight bookings since 2020
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="mt-4 text-muted-foreground">
              To revolutionize the way people book flights by providing a
              seamless, transparent, and secure booking experience. We believe
              travel should be accessible to everyone, and booking should never
              be a hassle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Our Vision</h2>
            <p className="mt-4 text-muted-foreground">
              To become the world&apos;s most trusted flight booking platform,
              known for exceptional customer service, innovative technology, and
              unwavering commitment to traveler satisfaction.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-center text-3xl font-bold">Our Values</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Customer First",
                desc: "Every decision starts with our customers in mind",
              },
              {
                icon: Award,
                title: "Excellence",
                desc: "We strive for excellence in everything we do",
              },
              {
                icon: Target,
                title: "Integrity",
                desc: "Transparent pricing with no hidden fees",
              },
              {
                icon: Eye,
                title: "Innovation",
                desc: "Continuously improving our platform",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 grid gap-8 text-center sm:grid-cols-3"
        >
          {[
            { number: "100K+", label: "Happy Travelers" },
            { number: "50+", label: "Airlines" },
            { number: "1000+", label: "Destinations" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-8"
            >
              <p className="text-4xl font-bold text-primary">{stat.number}</p>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
