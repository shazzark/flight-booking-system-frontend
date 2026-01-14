"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, XCircle, Loader2 } from "lucide-react";
import { Button } from "../../_component/_ui/button";
import { ProtectedRoute } from "../../_component/protectedRoutes";
import { StatusBadge } from "../../_component/status-badge";
import { bookingAPI } from "../../_lib/apiService";
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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // const data = await bookingAPI.getAllBookings();

      // const transformedBookings = data.map((booking) => ({
      //   id: booking._id || booking.id,
      //   passengerName: booking.passengerName || "",
      //   passengerEmail: booking.passengerEmail || "",
      //   flight: {
      //     flightNumber: booking.flight?.flightNumber || "",
      //     origin: booking.flight?.origin || "",
      //     destination: booking.flight?.destination || "",
      //   },
      //   status: booking.status?.toLowerCase() || "pending",
      //   paymentStatus: booking.paymentStatus?.toLowerCase() || "pending",
      //   totalAmount: booking.totalAmount || 0,
      // }));

      const data = await bookingAPI.getAllBookings();
      const bookingsArray = Array.isArray(data) ? data : data?.bookings || [];

      const transformedBookings = bookingsArray.map((booking) => ({
        id: booking._id || booking.id,
        passengerName: booking.passengerName || "",
        passengerEmail: booking.passengerEmail || "",
        flight: {
          flightNumber: booking.flight?.flightNumber || "",
          origin: booking.flight?.origin || "",
          destination: booking.flight?.destination || "",
        },
        status: booking.status?.toLowerCase() || "pending",
        paymentStatus: booking.paymentStatus?.toLowerCase() || "pending",
        totalAmount: booking.totalAmount || 0,
      }));

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
      await fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setCancellingId(null);
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
          >
            <h1 className="text-3xl font-bold sm:text-4xl">All Bookings</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage all flight bookings
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total",
                count: bookings.length,
                color: "text-foreground",
              },
              {
                label: "Confirmed",
                count: bookings.filter((b) => b.status === "confirmed").length,
                color: "text-status-confirmed",
              },
              {
                label: "Pending",
                count: bookings.filter((b) => b.status === "pending").length,
                color: "text-status-pending",
              },
              {
                label: "Cancelled",
                count: bookings.filter((b) => b.status === "cancelled").length,
                color: "text-status-cancelled",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.count}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 overflow-hidden rounded-xl border border-border"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Booking ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Passenger
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Flight
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary/30">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm">{booking.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{booking.passengerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.passengerEmail}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">
                              {booking.flight.flightNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.flight.origin.split(" ")[0]} →{" "}
                              {booking.flight.destination.split(" ")[0]}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={booking.paymentStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-primary">
                          ${booking.totalAmount}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {booking.status === "confirmed" ||
                        booking.status === "pending" ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                disabled={cancellingId === booking.id}
                              >
                                {cancellingId === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                  </>
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Booking
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel booking{" "}
                                  {booking.id}? This will notify the passenger.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep Booking
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
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
