// Base configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://flight-booking-system-backend-api.onrender.com/api/v1";

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Base fetch function
// const apiFetch = async (endpoint, options = {}) => {
//   const defaultHeaders = {
//     "Content-Type": "application/json",
//   };

//   const config = {
//     ...options,
//     headers: {
//       ...defaultHeaders,
//       ...options.headers,
//     },
//     credentials: "include", // Important for cookies
//   };

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new ApiError(
//       errorData.message || `HTTP ${response.status}`,
//       response.status
//     );
//   }

//   return response.json();
// };

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const apiFetch = async (endpoint, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  const isAuthEndpoint =
    endpoint.includes("/login") || endpoint.includes("/signup");

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(token && !isAuthEndpoint ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status
    );
  }

  return response.json();
};

// ==================== AUTHENTICATION ====================
export const authAPI = {
  login: async (email, password) => {
    return apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return apiFetch("/users/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiFetch("/users/logout", {
      method: "POST",
    });
  },

  getCurrentUser: async () => {
    return apiFetch("/users/me");
  },

  // getCurrentUser: async () => {
  //   return apiFetch("/users/me", {
  //     credentials: "include", // ← ADD THIS
  //   });
  // },

  updateProfile: async (userData) => {
    return apiFetch("/users/updateMe", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  updatePassword: async (currentPassword, newPassword, newPasswordConfirm) => {
    return apiFetch("/users/updateMyPassword", {
      method: "PATCH",
      body: JSON.stringify({
        passwordCurrent: currentPassword,
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      }),
    });
  },
};

// ==================== FLIGHTS ====================
export const flightAPI = {
  getAllFlights: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/flights${queryString ? `?${queryString}` : ""}`;
    return apiFetch(url);
  },

  searchFlights: async (origin, destination, departureDate, passengers = 1) => {
    const params = {
      origin,
      destination,
      departureDate,
      passengers,
    };
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/flights/search?${queryString}`);
  },

  getFlight: async (flightId) => {
    return apiFetch(`/flights/${flightId}`);
  },

  // Admin only
  createFlight: async (flightData) => {
    return apiFetch("/flights", {
      method: "POST",
      body: JSON.stringify(flightData),
    });
  },

  updateFlight: async (flightId, flightData) => {
    return apiFetch(`/flights/${flightId}`, {
      method: "PATCH",
      body: JSON.stringify(flightData),
    });
  },

  deleteFlight: async (flightId) => {
    return apiFetch(`/flights/${flightId}`, {
      method: "DELETE",
    });
  },

  cancelFlight: async (flightId) => {
    return apiFetch(`/flights/${flightId}/cancel`, {
      method: "PATCH",
    });
  },

  getFlightStats: async () => {
    return apiFetch("/flights/stats/flight-stats");
  },
};

// ==================== BOOKINGS ====================
export const bookingAPI = {
  getMyBookings: async () => {
    return apiFetch("/bookings/my-bookings");
  },

  getBooking: async (bookingId) => {
    return apiFetch(`/bookings/${bookingId}`);
  },

  createBooking: async (bookingData) => {
    return apiFetch("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  cancelBooking: async (bookingId) => {
    return apiFetch(`/bookings/${bookingId}/cancel`, {
      method: "PATCH",
    });
  },

  // Admin only
  getAllBookings: async () => {
    return apiFetch("/bookings");
  },

  getBookingStats: async () => {
    return apiFetch("/bookings/stats/booking-stats");
  },
};

// ==================== PAYMENTS ====================
export const paymentAPI = {
  initiatePayment: async (paymentData) => {
    return apiFetch("/payments/initiate", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  verifyPayment: async (reference) => {
    return apiFetch(`/payments/verify?reference=${reference}`);
  },

  getMyPayments: async () => {
    return apiFetch("/payments/my-payments");
  },

  getPayment: async (paymentId) => {
    return apiFetch(`/payments/${paymentId}`);
  },

  // Admin only
  getAllPayments: async () => {
    return apiFetch("/payments");
  },

  refundPayment: async (paymentId, reason) => {
    return apiFetch("/payments/refund", {
      method: "POST",
      body: JSON.stringify({ paymentId, reason }),
    });
  },

  getPaymentStats: async () => {
    return apiFetch("/payments/stats/payment-stats");
  },
};

// ==================== USERS (Admin only) ====================
export const userAPI = {
  getAllUsers: async () => {
    return apiFetch("/users");
  },

  getUser: async (userId) => {
    return apiFetch(`/users/${userId}`);
  },

  updateUser: async (userId, userData) => {
    return apiFetch(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId) => {
    return apiFetch(`/users/${userId}`, {
      method: "DELETE",
    });
  },

  getUserDashboardStats: async () => {
    return apiFetch("/users/dashboard-stats");
  },
};

// Export all APIs in one object
export const apiService = {
  auth: authAPI,
  flights: flightAPI,
  bookings: bookingAPI,
  payments: paymentAPI,
  users: userAPI,
};

export default apiService;
