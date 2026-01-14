"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../_component/_ui/button";
import { ProtectedRoute } from "../_component/protectedRoutes";
import { StatusBadge } from "../_component/status-badge";
import { bookingAPI } from "../_lib/apiService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../_component/_ui/alert-dialog";

function BookingsPageContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // const data = await bookingAPI.getMyBookings();
      // Transform API data to match the expected structure
      // const transformedBookings = data.map((booking) => ({
      //   id: booking._id || booking.id,
      //   flightId: booking.flight?._id || booking.flightId,
      //   flight: {
      //     airline: booking.flight?.airline || "",
      //     flightNumber: booking.flight?.flightNumber || "",
      //     origin: booking.flight?.origin || "",
      //     destination: booking.flight?.destination || "",
      //     departureTime: booking.flight?.departureTime || "",
      //     arrivalTime: booking.flight?.arrivalTime || "",
      //     duration: booking.flight?.duration || "",
      //   },
      //   userId: booking.user?._id || booking.userId,
      //   passengerName: booking.passengerName || "",
      //   passengerEmail: booking.passengerEmail || "",
      //   seatNumber: booking.seatNumber || "",
      //   status: booking.status?.toLowerCase() || "pending",
      //   paymentStatus: booking.paymentStatus?.toLowerCase() || "pending",
      //   totalAmount: booking.totalAmount || 0,
      //   createdAt: booking.createdAt || new Date().toISOString(),
      // }));
      const data = await bookingAPI.getMyBookings();

      // Safely get the array
      const bookingsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];

      const transformedBookings = bookingsArray.map((booking) => ({
        id: booking._id || booking.id,
        flightId: booking.flight?._id || booking.flightId,
        flight: {
          airline: booking.flight?.airline || "",
          flightNumber: booking.flight?.flightNumber || "",
          origin: booking.flight?.origin || "",
          destination: booking.flight?.destination || "",
          departureTime: booking.flight?.departureTime || "",
          arrivalTime: booking.flight?.arrivalTime || "",
          duration: booking.flight?.duration || "",
        },
        userId: booking.user?._id || booking.userId,
        passengerName: booking.passengerName || "",
        passengerEmail: booking.passengerEmail || "",
        seatNumber: booking.seatNumber || "",
        status: booking.status?.toLowerCase() || "pending",
        paymentStatus: booking.paymentStatus?.toLowerCase() || "pending",
        totalAmount: booking.totalAmount || 0,
        createdAt: booking.createdAt || new Date().toISOString(),
      }));

      setBookings(transformedBookings);

      setBookings(transformedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await bookingAPI.cancelBooking(bookingId);
      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">My Bookings</h1>
              <p className="mt-2 text-muted-foreground">
                View and manage your flight bookings
              </p>
            </div>
            <Button asChild>
              <Link href="/search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Book New Flight
              </Link>
            </Button>
          </motion.div>

          {bookings.length > 0 ? (
            <div className="mt-8 space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {booking.id}
                      </span>
                      <StatusBadge status={booking.status} />
                      <StatusBadge status={booking.paymentStatus} />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">
                        {booking.flight.airline} • {booking.flight.flightNumber}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div>
                        <p className="text-xl font-bold">
                          {booking.flight.departureTime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.flight.origin}
                        </p>
                      </div>
                      <div className="flex flex-1 items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <Plane className="h-4 w-4 text-primary" />
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {booking.flight.arrivalTime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.flight.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {booking.flight.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Seat {booking.seatNumber}
                    </span>
                    <span>Passenger: {booking.passengerName}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-xl font-bold text-primary">
                        ${booking.totalAmount}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Link href={`/bookings/${booking.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      {booking.status === "confirmed" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive/50 text-destructive bg-transparent"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel Booking
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking?
                                This action cannot be undone. Refund policies
                                may apply.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Booking
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelBooking(booking.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {cancellingId === booking.id
                                  ? "Cancelling..."
                                  : "Cancel Booking"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 rounded-xl border border-border bg-card p-12 text-center"
            >
              <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Bookings Yet</h3>
              <p className="mt-2 text-muted-foreground">
                You haven&apos;t made any flight bookings yet.
              </p>
              <Button asChild className="mt-4">
                <Link href="/search">Search Flights</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingsPageContent />
    </Suspense>
  );
}
