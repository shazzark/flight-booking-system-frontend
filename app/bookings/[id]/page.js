"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plane,
  Calendar,
  User,
  Mail,
  CreditCard,
  ArrowLeft,
  Download,
  XCircle,
  AlertCircle,
  Loader2,
  Clock,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "../../_component/_ui/button";
import { ProtectedRoute } from "../../_component/protectedRoutes";
import { StatusBadge } from "../../_component/status-badge";
import { bookingAPI } from "../../_lib/apiService";
import { useToast } from "../../context/toast-context";
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
} from "../../_component/_ui/alert-dialog";
import React from "react";

export default function BookingDetailsPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { addToast } = useToast();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        router.push("/bookings");
        return;
      }

      try {
        const response = await bookingAPI.getBooking(id);
        setBooking(response.data.booking);
      } catch (error) {
        console.error("Error fetching booking:", error);
        addToast("Failed to load booking details", "error");
        router.push("/bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, router, addToast]);

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      await bookingAPI.cancelBooking(id);

      // Update local state
      setBooking((prev) => ({
        ...prev,
        status: "cancelled",
        paymentStatus: "refunded",
      }));

      addToast("Booking cancelled successfully", "success");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      addToast(error.message || "Failed to cancel booking", "error");
    } finally {
      setCancelling(false);
    }
  };

  // Format functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["user"]}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!booking) {
    return (
      <ProtectedRoute allowedRoles={["user"]}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Booking Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The requested booking could not be found.
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => router.push("/bookings")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Format flight data for display
  const flight = booking.flight || {};
  const firstPassenger = booking.passengers?.[0] || {};
  const totalPassengers = booking.passengers?.length || 0;

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/bookings")}
              className="mb-4 text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Booking Details</h1>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {booking.bookingReference}
                </p>
                <p className="text-sm text-muted-foreground">
                  Booked on {formatDateTime(booking.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={booking.status} />
                <StatusBadge status={booking.paymentStatus} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 rounded-xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">Flight Information</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                {flight.airline} • {flight.flightNumber}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {flight.departureTime
                    ? formatTime(flight.departureTime)
                    : "N/A"}
                </p>
                <p className="text-sm font-medium">{flight.origin}</p>
                <p className="text-xs text-muted-foreground">
                  {flight.departureTime
                    ? formatDate(flight.departureTime)
                    : "N/A"}
                </p>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <div className="flex flex-col items-center">
                  <Plane className="h-5 w-5 text-primary" />
                  <span className="mt-1 text-xs text-muted-foreground">
                    {flight.duration} min
                  </span>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {flight.arrivalTime ? formatTime(flight.arrivalTime) : "N/A"}
                </p>
                <p className="text-sm font-medium">{flight.destination}</p>
                <p className="text-xs text-muted-foreground">
                  {flight.arrivalTime ? formatDate(flight.arrivalTime) : "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {flight.duration} min
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Direct flight
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Passenger Details</h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{totalPassengers} passenger(s)</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {booking.passengers?.map((passenger, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Passenger {index + 1}
                      </p>
                      <p className="font-medium">{passenger.name}</p>
                    </div>
                  </div>
                  <div className="ml-13 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{passenger.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Seat: {passenger.seatNumber}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 rounded-xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">Payment Summary</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Flight Fare ({totalPassengers} passenger
                  {totalPassengers !== 1 ? "s" : ""})
                </span>
                <span>${booking.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  ${booking.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Payment Status</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {booking.paymentStatus}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-between gap-4"
          >
            <Button variant="outline" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Download E-Ticket
            </Button>
            {(booking.status === "confirmed" ||
              booking.status === "pending") && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-destructive/50 text-destructive bg-transparent"
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Cancel Booking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel booking{" "}
                      <span className="font-mono">
                        {booking.bookingReference}
                      </span>
                      ? This action cannot be undone. Refund policies may apply.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={cancelling}>
                      Keep Booking
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {cancelling ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
