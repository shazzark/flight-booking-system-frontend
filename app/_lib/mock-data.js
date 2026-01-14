// Mock flights data
export const mockFlights = [
  {
    id: "FL001",
    airline: "SkyWings",
    flightNumber: "SW101",
    origin: "New York (JFK)",
    destination: "Los Angeles (LAX)",
    departureTime: "08:00",
    arrivalTime: "11:30",
    duration: "5h 30m",
    price: 299,
    availableSeats: 45,
    aircraft: "Boeing 737-800",
  },
  {
    id: "FL002",
    airline: "AeroJet",
    flightNumber: "AJ205",
    origin: "New York (JFK)",
    destination: "Los Angeles (LAX)",
    departureTime: "14:00",
    arrivalTime: "17:15",
    duration: "5h 15m",
    price: 349,
    availableSeats: 28,
    aircraft: "Airbus A320",
  },
  {
    id: "FL003",
    airline: "CloudAir",
    flightNumber: "CA310",
    origin: "London (LHR)",
    destination: "Paris (CDG)",
    departureTime: "09:30",
    arrivalTime: "11:45",
    duration: "1h 15m",
    price: 89,
    availableSeats: 62,
    aircraft: "Airbus A319",
  },
  {
    id: "FL004",
    airline: "SkyWings",
    flightNumber: "SW422",
    origin: "Tokyo (NRT)",
    destination: "Seoul (ICN)",
    departureTime: "10:00",
    arrivalTime: "12:30",
    duration: "2h 30m",
    price: 159,
    availableSeats: 35,
    aircraft: "Boeing 787-9",
  },
  {
    id: "FL005",
    airline: "GulfAir",
    flightNumber: "GA118",
    origin: "Dubai (DXB)",
    destination: "Singapore (SIN)",
    departureTime: "22:00",
    arrivalTime: "09:30",
    duration: "7h 30m",
    price: 399,
    availableSeats: 18,
    aircraft: "Airbus A380",
  },
  {
    id: "FL006",
    airline: "OceanicWings",
    flightNumber: "OW901",
    origin: "Sydney (SYD)",
    destination: "Auckland (AKL)",
    departureTime: "06:45",
    arrivalTime: "11:00",
    duration: "3h 15m",
    price: 179,
    availableSeats: 52,
    aircraft: "Boeing 737 MAX 8",
  },
  {
    id: "FL007",
    airline: "SunAir",
    flightNumber: "SA555",
    origin: "Miami (MIA)",
    destination: "Cancun (CUN)",
    departureTime: "11:00",
    arrivalTime: "13:15",
    duration: "2h 15m",
    price: 149,
    availableSeats: 40,
    aircraft: "Airbus A321",
  },
  {
    id: "FL008",
    airline: "EuroConnect",
    flightNumber: "EC202",
    origin: "Frankfurt (FRA)",
    destination: "Rome (FCO)",
    departureTime: "15:30",
    arrivalTime: "17:20",
    duration: "1h 50m",
    price: 119,
    availableSeats: 55,
    aircraft: "Embraer E190",
  },
];

// Mock bookings data
export const mockBookings = [
  {
    id: "BK001",
    flightId: "FL001",
    flight: mockFlights[0],
    userId: "1",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    seatNumber: "12A",
    status: "confirmed",
    paymentStatus: "completed",
    totalAmount: 299,
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "BK002",
    flightId: "FL003",
    flight: mockFlights[2],
    userId: "1",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    seatNumber: "5C",
    status: "pending",
    paymentStatus: "pending",
    totalAmount: 89,
    createdAt: "2025-01-11T14:30:00Z",
  },
  {
    id: "BK003",
    flightId: "FL005",
    flight: mockFlights[4],
    userId: "1",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    seatNumber: "22F",
    status: "cancelled",
    paymentStatus: "failed",
    totalAmount: 399,
    createdAt: "2025-01-08T09:15:00Z",
  },
];

// Mock payments data
export const mockPayments = [
  {
    id: "PAY001",
    bookingId: "BK001",
    amount: 299,
    status: "completed",
    method: "Credit Card",
    transactionId: "TXN_ABC123",
    createdAt: "2025-01-10T10:05:00Z",
  },
  {
    id: "PAY002",
    bookingId: "BK002",
    amount: 89,
    status: "pending",
    method: "Credit Card",
    transactionId: "TXN_DEF456",
    createdAt: "2025-01-11T14:35:00Z",
  },
  {
    id: "PAY003",
    bookingId: "BK003",
    amount: 399,
    status: "failed",
    method: "Credit Card",
    transactionId: "TXN_GHI789",
    createdAt: "2025-01-08T09:20:00Z",
  },
];

// Search flights function
export function searchFlights(origin, destination, date) {
  let results = [...mockFlights];

  if (origin) {
    results = results.filter(
      (f) =>
        f.origin.toLowerCase().includes(origin.toLowerCase()) ||
        f.origin
          .toLowerCase()
          .replace(/[()]/g, "")
          .includes(origin.toLowerCase())
    );
  }

  if (destination) {
    results = results.filter(
      (f) =>
        f.destination.toLowerCase().includes(destination.toLowerCase()) ||
        f.destination
          .toLowerCase()
          .replace(/[()]/g, "")
          .includes(destination.toLowerCase())
    );
  }

  return results;
}

// Get flight by ID
export function getFlightById(id) {
  return mockFlights.find((f) => f.id === id);
}

// Get bookings for user
export function getUserBookings(userId) {
  return mockBookings.filter((b) => b.userId === userId);
}

// Get booking by ID
export function getBookingById(id) {
  return mockBookings.find((b) => b.id === id);
}
