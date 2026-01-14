"use client";

import { Fragment, useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../_component/_ui/button";
import { Input } from "../../_component/_ui/input";
import { Label } from "../../_component/_ui/label";
import { ProtectedRoute } from "../../_component/protectedRoutes";
import { cn } from "../../utilis";
import { flightAPI, bookingAPI, paymentAPI } from "../../_lib/apiService";
import { useToast } from "../../context/toast-context";

const steps = [
  { id: "details", label: "Passenger Details", icon: User },
  { id: "seat", label: "Seat Selection", icon: Plane },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmation", label: "Confirmation", icon: CheckCircle },
];

function generateSeats(availableSeats) {
  const rows = 10;
  const cols = ["A", "B", "C", "", "D", "E", "F"];
  const seats = [];

  for (let row = 1; row <= rows; row++) {
    for (const col of cols) {
      if (col === "") continue;
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        available: Math.random() > 0.3,
      });
    }
  }

  return seats;
}

export default function BookingPage({ params }) {
  const { flightId } = React.use(params);
  const router = useRouter();
  const { addToast } = useToast();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState("details");
  const [isProcessing, setIsProcessing] = useState(false);

  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [seats, setSeats] = useState([]);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  // Fetch flight details
  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await flightAPI.getFlight(flightId);
        setFlight(response.data.flight);
        // setFlight(response.data.data.flight);

        // Generate seats based on available seats
        const generatedSeats = generateSeats(
          response.data.flight.seatsAvailable
        );
        setSeats(generatedSeats);
      } catch (error) {
        console.error("Error fetching flight:", error);
        addToast("Failed to load flight details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [flightId, addToast]);

  // Auto-select first available seat
  useEffect(() => {
    if (seats.length > 0 && !selectedSeat) {
      const availableSeat = seats.find((seat) => seat.available);
      if (availableSeat) {
        setSelectedSeat(availableSeat.id);
      }
    }
  }, [seats, selectedSeat]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["user"]}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!flight) {
    return (
      <ProtectedRoute allowedRoles={["user"]}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Flight Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The requested flight could not be found.
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => router.push("/search")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleCreateBooking = async () => {
    setIsProcessing(true);

    try {
      const bookingData = {
        flightId: flightId,
        passengers: [
          {
            name: passengerName,
            email: passengerEmail,
            phone: passengerPhone,
            seatNumber: selectedSeat,
          },
        ],
        seatNumber: selectedSeat,
      };

      const bookingResponse = await bookingAPI.createBooking(bookingData);
      setBooking(bookingResponse.data.booking);

      addToast("Booking created successfully!", "success");
      setCurrentStep("payment");
    } catch (error) {
      console.error("Booking error:", error);
      addToast(error.message || "Failed to create booking", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const paymentData = {
        bookingId: booking._id,
        email: passengerEmail,
        amount: flight.basePrice * 1.15, // Price + 15% tax
      };

      const paymentResponse = await paymentAPI.initiatePayment(paymentData);
      setPayment(paymentResponse.data);

      // Redirect to PayStack payment page
      window.location.href = paymentResponse.data.authorization_url;
    } catch (error) {
      console.error("Payment error:", error);
      addToast(error.message || "Failed to initialize payment", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === "details") {
      setCurrentStep("seat");
    } else if (currentStep === "seat") {
      await handleCreateBooking();
    } else if (currentStep === "payment") {
      await handlePayment();
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "seat") {
      setCurrentStep("details");
    } else if (currentStep === "payment") {
      setCurrentStep("seat");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "details":
        return passengerName && passengerEmail && passengerPhone;
      case "seat":
        return selectedSeat !== "";
      case "payment":
        return cardNumber && expiryDate && cvv && cardName && booking;
      default:
        return false;
    }
  };

  // Format date and time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/search")}
              className="mb-4 text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
            <h1 className="text-3xl font-bold">Book Your Flight</h1>
            <p className="mt-2 text-muted-foreground">
              Complete the steps below to finalize your booking
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">
                  {flight.airline} • {flight.flightNumber}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xl font-bold">{flight.origin}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xl font-bold">
                    {flight.destination}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(flight.departureTime)} -{" "}
                    {formatTime(flight.arrivalTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(flight.departureTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Plane className="h-4 w-4" />
                    {flight.duration} min
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-3xl font-bold text-primary">
                  ${flight.basePrice}
                </p>
                <p className="text-xs text-muted-foreground">
                  + ${Math.round(flight.basePrice * 0.15)} taxes & fees
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      index <= currentStepIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "ml-2 hidden text-sm font-medium sm:block",
                      index <= currentStepIndex
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "mx-4 h-0.5 flex-1 transition-colors",
                        index < currentStepIndex ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentStep === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h2 className="mb-6 text-xl font-semibold">
                  Passenger Details
                </h2>
                <div className="space-y-4">
                  <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-medium">Important:</p>
                        <p className="mt-1">
                          Passenger name must match government-issued ID
                          exactly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name (as on ID)
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "seat" && (
              <motion.div
                key="seat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h2 className="mb-6 text-xl font-semibold">Select Your Seat</h2>
                <div className="mb-6 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-secondary" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-muted" />
                    <span>Unavailable</span>
                  </div>
                </div>

                <div className="mx-auto max-w-md">
                  <div className="mb-4 text-center text-sm text-muted-foreground">
                    Front of Aircraft
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {["A", "B", "C", "", "D", "E", "F"].map((col, colIndex) => (
                      <div
                        key={colIndex}
                        className="text-center text-xs font-medium text-muted-foreground"
                      >
                        {col}
                      </div>
                    ))}
                    {Array.from({ length: 10 }).map((_, rowIndex) => (
                      <Fragment key={rowIndex}>
                        {["A", "B", "C", "", "D", "E", "F"].map((col) => {
                          if (col === "") {
                            return (
                              <div
                                key={`${rowIndex}-aisle`}
                                className="flex items-center justify-center text-xs text-muted-foreground"
                              >
                                {rowIndex + 1}
                              </div>
                            );
                          }
                          const seatId = `${rowIndex + 1}${col}`;
                          const seat = seats.find((s) => s.id === seatId);
                          const isAvailable = seat?.available ?? false;
                          const isSelected = selectedSeat === seatId;

                          return (
                            <button
                              key={seatId}
                              disabled={!isAvailable || isProcessing}
                              onClick={() => setSelectedSeat(seatId)}
                              className={cn(
                                "flex h-8 w-full items-center justify-center rounded text-xs font-medium transition-colors",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : isAvailable
                                  ? "bg-secondary hover:bg-secondary/80"
                                  : "cursor-not-allowed bg-muted text-muted-foreground"
                              )}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </Fragment>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    Back of Aircraft
                  </div>
                </div>

                {selectedSeat && (
                  <p className="mt-6 text-center">
                    Selected seat:{" "}
                    <span className="font-bold text-primary">
                      {selectedSeat}
                    </span>
                  </p>
                )}
              </motion.div>
            )}

            {currentStep === "payment" && booking && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h2 className="mb-6 text-xl font-semibold">Payment Details</h2>

                <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">Booking Created!</p>
                      <p className="mt-1">
                        Booking Reference:{" "}
                        <span className="font-mono">
                          {booking.bookingReference}
                        </span>
                      </p>
                      <p className="mt-1">
                        Proceed to payment to confirm your booking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Flight ({flight.flightNumber})</span>
                    <span>${flight.basePrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Seat ({selectedSeat})</span>
                    <span>$0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Taxes & Fees</span>
                    <span>${Math.round(flight.basePrice * 0.15)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      ${flight.basePrice + Math.round(flight.basePrice * 0.15)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentStep !== "confirmation" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-6 flex items-center justify-between"
            >
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === "details" || isProcessing}
                className="bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!canProceed() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === "payment" ? (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay $
                    {flight.basePrice + Math.round(flight.basePrice * 0.15)}
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
