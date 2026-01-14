"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Plane,
  Edit,
  Clock,
  Users,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "../../_component/_ui/button";
import { Input } from "../../_component/_ui/input";
import { Label } from "../../_component/_ui/label";
import { ProtectedRoute } from "../../_component/protectedRoutes";
import { flightAPI } from "../../_lib/apiService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../_component/_ui/dialog";

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);

  const [airline, setAirline] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [price, setPrice] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      // const data = await flightAPI.getAllFlights();

      // const transformedFlights = data.map((flight) => ({
      //   id: flight._id || flight.id,
      //   airline: flight.airline || "",
      //   flightNumber: flight.flightNumber || "",
      //   origin: flight.origin || "",
      //   destination: flight.destination || "",
      //   departureTime: flight.departureTime || "",
      //   arrivalTime: flight.arrivalTime || "",
      //   duration: flight.duration || "0h 00m",
      //   price: flight.price || 0,
      //   availableSeats: flight.availableSeats || 0,
      //   aircraft: flight.aircraft || "Unknown",
      // }));
      const res = await flightAPI.getAllFlights(); // res is the full object
      const flightsArray = res?.data?.flights || []; // this is the array

      const transformedFlights = flightsArray.map((flight) => ({
        id: flight._id || flight.id,
        airline: flight.airline || "",
        flightNumber: flight.flightNumber || "",
        origin: flight.origin || "",
        destination: flight.destination || "",
        departureTime: flight.departureTime || "",
        arrivalTime: flight.arrivalTime || "",
        price: flight.price || 0,
      }));

      setFlights(transformedFlights);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAirline("");
    setFlightNumber("");
    setOrigin("");
    setDestination("");
    setDepartureTime("");
    setArrivalTime("");
    setPrice("");
    setAvailableSeats("");
    setEditingFlight(null);
  };

  const openEditDialog = (flight) => {
    setEditingFlight(flight);
    setAirline(flight.airline);
    setFlightNumber(flight.flightNumber);
    setOrigin(flight.origin);
    setDestination(flight.destination);
    setDepartureTime(flight.departureTime);
    setArrivalTime(flight.arrivalTime);
    setPrice(flight.price.toString());
    setAvailableSeats(flight.availableSeats.toString());
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const flightData = {
      airline,
      flightNumber,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price: Number(price),
      availableSeats: Number(availableSeats),
      aircraft: "Boeing 737-800",
      duration: "3h 00m",
    };

    try {
      if (editingFlight) {
        await flightAPI.updateFlight(editingFlight.id, flightData);
      } else {
        await flightAPI.createFlight(flightData);
      }
      await fetchFlights();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving flight:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Manage Flights</h1>
              <p className="mt-2 text-muted-foreground">
                Create and manage flight schedules
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Flight
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingFlight ? "Edit Flight" : "Add New Flight"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingFlight
                        ? "Update flight details below."
                        : "Enter the flight details below."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="airline">Airline</Label>
                        <Input
                          id="airline"
                          value={airline}
                          onChange={(e) => setAirline(e.target.value)}
                          placeholder="SkyWings"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="flightNumber">Flight Number</Label>
                        <Input
                          id="flightNumber"
                          value={flightNumber}
                          onChange={(e) => setFlightNumber(e.target.value)}
                          placeholder="SW101"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin</Label>
                        <Input
                          id="origin"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          placeholder="New York (JFK)"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Los Angeles (LAX)"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="departureTime">Departure Time</Label>
                        <Input
                          id="departureTime"
                          value={departureTime}
                          onChange={(e) => setDepartureTime(e.target.value)}
                          placeholder="08:00"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arrivalTime">Arrival Time</Label>
                        <Input
                          id="arrivalTime"
                          value={arrivalTime}
                          onChange={(e) => setArrivalTime(e.target.value)}
                          placeholder="11:30"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="299"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seats">Available Seats</Label>
                        <Input
                          id="seats"
                          type="number"
                          value={availableSeats}
                          onChange={(e) => setAvailableSeats(e.target.value)}
                          placeholder="150"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingFlight ? "Updating..." : "Creating..."}
                        </>
                      ) : editingFlight ? (
                        "Update Flight"
                      ) : (
                        "Create Flight"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 overflow-hidden rounded-xl border border-border"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Flight
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Schedule
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {flights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-secondary/30">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{flight.flightNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {flight.airline}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">
                          {flight.origin.split(" ")[0]} →{" "}
                          {flight.destination.split(" ")[0]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.aircraft}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {flight.departureTime} - {flight.arrivalTime}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {flight.duration}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 font-medium text-primary">
                          <DollarSign className="h-4 w-4" />
                          {flight.price}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {flight.availableSeats}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(flight)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
