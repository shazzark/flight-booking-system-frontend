"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane, Calendar, Search } from "lucide-react";
import { Button } from "../_ui/button";
import { Input } from "../_ui/input";
import { Label } from "../_ui/label";

export function SearchPreview() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.set("origin", origin);
    if (destination) params.set("destination", destination);
    if (date) params.set("date", date);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
        >
          <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
            Quick Flight Search
          </h2>
          <form
            onSubmit={handleSearch}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center gap-2">
                <Plane className="h-4 w-4 rotate-45" />
                From
              </Label>
              <Input
                id="origin"
                placeholder="City or Airport"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <Plane className="h-4 w-4 -rotate-45" />
                To
              </Label>
              <Input
                id="destination"
                placeholder="City or Airport"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Departure Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Search Flights
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
