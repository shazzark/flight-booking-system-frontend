"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Plane,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "../_component/_ui/button";
import { Input } from "../_component/_ui/input";
import { Label } from "../_component/_ui/label";
import { ProtectedRoute } from "../_component/protectedRoutes";
import { flightAPI } from "../_lib/apiService";
import { useToast } from "../context/toast-context";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();

  const [origin, setOrigin] = useState(searchParams.get("origin") || "");
  const [destination, setDestination] = useState(
    searchParams.get("destination") || ""
  );
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [flights, setFlights] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get("origin") || searchParams.get("destination")) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!origin || !destination || !date) {
      addToast("Please fill in all search fields", "error");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Call real API
      const response = await flightAPI.searchFlights(origin, destination, date);

      // Transform API data to match your design format
      const formattedFlights = response.data.flights.map((flight, index) => ({
        id: flight._id || `FL${index + 1}`,
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        origin: `${flight.origin}`,
        destination: `${flight.destination}`,
        departureTime: new Date(flight.departureTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        arrivalTime: new Date(flight.arrivalTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: `${Math.floor(flight.duration / 60)}h ${
          flight.duration % 60
        }m`,
        price: flight.basePrice,
        availableSeats: flight.seatsAvailable,
        aircraft: "Boeing 737-800", // You can add aircraft field to your flight model
      }));

      // const formattedFlights = response.data.flights.map((flight) => ({
      //   _id: flight._id,
      //   airline: flight.airline,
      //   flightNumber: flight.flightNumber,
      //   origin: flight.origin,
      //   destination: flight.destination,
      //   departureTime: new Date(flight.departureTime).toLocaleTimeString([], {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   }),
      //   arrivalTime: new Date(flight.arrivalTime).toLocaleTimeString([], {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   }),
      //   duration: `${Math.floor(flight.duration / 60)}h ${
      //     flight.duration % 60
      //   }m`,
      //   price: flight.basePrice,
      //   availableSeats: flight.seatsAvailable,
      //   aircraft: "Boeing 737-800",
      // }));

      setFlights(formattedFlights);

      if (formattedFlights.length === 0) {
        addToast("No flights found for your search criteria", "info");
      }
    } catch (error) {
      console.error("Search error:", error);
      addToast(error.message || "Failed to search flights", "error");
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookFlight = (flightId) => {
    router.push(`/booking/${flightId}`);
  };

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold sm:text-4xl">Search Flights</h1>
            <p className="mt-2 text-muted-foreground">
              Find the best flights for your journey
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <form
              onSubmit={handleSearch}
              className="rounded-xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="flex items-center gap-2">
                    <Plane className="h-4 w-4 rotate-45 text-muted-foreground" />
                    From
                  </Label>
                  <Input
                    id="origin"
                    placeholder="e.g., JFK"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    maxLength={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Airport code (3 letters)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="destination"
                    className="flex items-center gap-2"
                  >
                    <Plane className="h-4 w-4 -rotate-45 text-muted-foreground" />
                    To
                  </Label>
                  <Input
                    id="destination"
                    placeholder="e.g., LAX"
                    value={destination}
                    onChange={(e) =>
                      setDestination(e.target.value.toUpperCase())
                    }
                    maxLength={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Airport code (3 letters)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Departure Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>

          <div className="mt-8">
            {isSearching ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hasSearched ? (
              flights.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Found {flights.length} flight
                    {flights.length !== 1 ? "s" : ""}
                  </p>
                  {flights.map((flight, index) => (
                    <motion.div
                      key={flight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-secondary/30"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary">
                              {flight.airline}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              • {flight.flightNumber}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold">
                                {flight.departureTime}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {flight.origin}
                              </p>
                            </div>
                            <div className="flex flex-1 items-center gap-2">
                              <div className="h-px flex-1 bg-border" />
                              <div className="flex flex-col items-center gap-1">
                                <Plane className="h-4 w-4 text-primary" />
                                <span className="text-xs text-muted-foreground">
                                  {flight.duration}
                                </span>
                              </div>
                              <div className="h-px flex-1 bg-border" />
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold">
                                {flight.arrivalTime}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {flight.destination}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {flight.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {flight.availableSeats} seats available
                            </span>
                            <span>{flight.aircraft}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              From
                            </p>
                            <p className="text-3xl font-bold text-primary">
                              ${flight.price}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              per person
                            </p>
                          </div>
                          <Button
                            onClick={() => handleBookFlight(flight.id)}
                            className="whitespace-nowrap"
                          >
                            Book Flight
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No Flights Found
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search criteria or browse all available
                    flights.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={async () => {
                      // Show all flights
                      try {
                        setIsSearching(true);
                        const response = await flightAPI.getAllFlights();
                        const formattedFlights = response.data.flights.map(
                          (flight, index) => ({
                            id: flight._id,
                            airline: flight.airline,
                            flightNumber: flight.flightNumber,
                            origin: flight.origin,
                            destination: flight.destination,
                            departureTime: new Date(
                              flight.departureTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                            arrivalTime: new Date(
                              flight.arrivalTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                            duration: `${Math.floor(flight.duration / 60)}h ${
                              flight.duration % 60
                            }m`,
                            price: flight.basePrice,
                            availableSeats: flight.seatsAvailable,
                            aircraft: "Boeing 737-800",
                          })
                        );
                        setFlights(formattedFlights);
                        setHasSearched(true);
                      } catch (error) {
                        addToast("Failed to load flights", "error");
                      } finally {
                        setIsSearching(false);
                      }
                    }}
                  >
                    View All Flights
                  </Button>
                </div>
              )
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  Search for Flights
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Enter your travel details above to find available flights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
