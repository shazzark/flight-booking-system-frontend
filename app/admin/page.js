"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane,
  BookOpen,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "../_component/_ui/button";
import { ProtectedRoute } from "../_component/protectedRoutes";
import { flightAPI, bookingAPI, paymentAPI, userAPI } from "../_lib/apiService";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    flights: [],
    bookings: [],
    payments: [],
    totalRevenue: 0,
    confirmedBookings: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [flightsData, bookingsData, paymentsData] = await Promise.all([
        flightAPI.getAllFlights(),
        bookingAPI.getAllBookings(),
        paymentAPI.getAllPayments(),
      ]);

      // Calculate totals
      const paymentsArray = paymentsData?.data?.payments || [];

      const totalRevenue = paymentsArray
        .filter((p) => p.status === "success")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const pendingPayments = paymentsArray.filter(
        (p) => p.status === "initiated"
      ).length;

      // const totalRevenue = paymentsData
      //   .filter((payment) => payment.status === "completed")
      //   .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      // const confirmedBookings = bookingsData.filter(
      //   (booking) => booking.status === "confirmed"
      // ).length;

      // const pendingPayments = paymentsData.filter(
      //   (payment) => payment.status === "pending"
      // ).length;

      // Transform recent bookings for display
      // const recentBookings = bookingsData.slice(0, 5).map((booking) => ({
      //   id: booking._id || booking.id,
      //   passengerName: booking.passengerName || "N/A",
      //   flight: {
      //     flightNumber: booking.flight?.flightNumber || "",
      //     origin: booking.flight?.origin || "",
      //     destination: booking.flight?.destination || "",
      //   },
      //   totalAmount: booking.totalAmount || 0,
      //   status: booking.status || "pending",
      // }));

      const bookingsArray = bookingsData?.data?.bookings || [];

      const confirmedBookings = bookingsArray.filter(
        (booking) => booking.status === "confirmed"
      ).length;

      const recentBookings = bookingsArray.slice(0, 5).map((booking) => ({
        id: booking._id || booking.id,
        passengerName: booking.passengerName || "N/A",
        flight: {
          flightNumber: booking.flight?.flightNumber || "",
          origin: booking.flight?.origin || "",
          destination: booking.flight?.destination || "",
        },
        totalAmount: booking.totalAmount || 0,
        status: booking.status || "pending",
      }));

      setDashboardData({
        flights: flightsData,
        bookings: recentBookings,
        payments: paymentsData,
        totalRevenue,
        confirmedBookings,
        pendingPayments,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Flights",
      value: dashboardData.flights.length,
      icon: Plane,
      href: "/admin/flights",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Bookings",
      value: dashboardData.bookings.length,
      icon: BookOpen,
      href: "/admin/bookings",
      color: "text-status-confirmed",
      bgColor: "bg-status-confirmed/10",
    },
    {
      label: "Pending Payments",
      value: dashboardData.pendingPayments,
      icon: CreditCard,
      href: "/admin/payments",
      color: "text-status-pending",
      bgColor: "bg-status-pending/10",
    },
    {
      label: "Revenue",
      value: `$${dashboardData.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      href: "/admin/payments",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

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
            <h1 className="text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Overview of your flight booking system
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={stat.href}
                  className="block rounded-xl border border-border bg-card p-6 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="mt-4 grid gap-3">
                <Button asChild className="justify-start">
                  <Link href="/admin/flights">
                    <Plane className="mr-2 h-4 w-4" />
                    Manage Flights
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="justify-start bg-transparent"
                >
                  <Link href="/admin/bookings">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Bookings
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="justify-start bg-transparent"
                >
                  <Link href="/admin/payments">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Payments
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Bookings</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/bookings">View All</Link>
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {dashboardData.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                  >
                    <div>
                      <p className="font-medium">{booking.passengerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.flight.flightNumber} •{" "}
                        {booking.flight.origin.split(" ")[0]} →{" "}
                        {booking.flight.destination.split(" ")[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">
                        ${booking.totalAmount}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {booking.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
