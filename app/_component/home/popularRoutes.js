"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";
import { Button } from "../_ui/button";

const routes = [
  {
    from: "New York",
    to: "Los Angeles",
    price: 199,
    image: "/los-angeles-skyline.jpg",
  },
  { from: "London", to: "Paris", price: 89, image: "/paris-eiffel-tower.jpg" },
  { from: "Tokyo", to: "Seoul", price: 159, image: "/seoul-city.jpg" },
  {
    from: "Dubai",
    to: "Singapore",
    price: 299,
    image: "/singapore-marina-bay.jpg",
  },
  {
    from: "Sydney",
    to: "Auckland",
    price: 179,
    image: "/auckland-new-zealand.jpg",
  },
  { from: "Miami", to: "Cancun", price: 149, image: "/cancun-beach.jpg" },
];

export function PopularRoutes() {
  return (
    <section className="border-t border-border bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Popular Routes</h2>
            <p className="mt-2 text-muted-foreground">
              Discover our most booked destinations
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/search" className="flex items-center gap-2">
              View All Routes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route, index) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group overflow-hidden rounded-xl border border-border bg-background transition-all hover:shadow-lg"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={route.image || "/placeholder.svg"}
                  alt={route.to}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{route.from}</span>
                    <Plane className="h-4 w-4" />
                    <span>{route.to}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-xl font-bold text-primary">
                    ${route.price}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link
                    href={`/search?origin=${route.from}&destination=${route.to}`}
                  >
                    Book Now
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
