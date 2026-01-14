"use client";

import { motion } from "framer-motion";
import { CreditCard, DollarSign } from "lucide-react";
import { ProtectedRoute } from "../../_component/protectedRoutes";
import { StatusBadge } from "../../_component/status-badge";
import { mockPayments, mockBookings } from "../../_lib/mock-data";

export default function AdminPaymentsPage() {
  const totalCompleted = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = mockPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = mockPayments
    .filter((p) => p.status === "failed")
    .reduce((sum, p) => sum + p.amount, 0);

  const enrichedPayments = mockPayments.map((payment) => {
    const booking = mockBookings.find((b) => b.id === payment.bookingId);
    return { ...payment, booking };
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold sm:text-4xl">Payments</h1>
            <p className="mt-2 text-muted-foreground">
              View all payment transactions
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Completed",
                amount: totalCompleted,
                color: "text-status-confirmed",
                bgColor: "bg-status-confirmed/10",
              },
              {
                label: "Pending",
                amount: totalPending,
                color: "text-status-pending",
                bgColor: "bg-status-pending/10",
              },
              {
                label: "Failed",
                amount: totalFailed,
                color: "text-status-cancelled",
                bgColor: "bg-status-cancelled/10",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <DollarSign className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.label} Payments
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  ${stat.amount.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 overflow-hidden rounded-xl border border-border"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Booking
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Passenger
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {enrichedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-secondary/30">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {payment.transactionId}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm">
                          {payment.bookingId}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">
                          {payment.booking?.passengerName || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm">{payment.method}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-primary">
                          ${payment.amount}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
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
