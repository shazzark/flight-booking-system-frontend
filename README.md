### **FRONTEND README.md**

```markdown
# Flight Booking System - Frontend

A modern, responsive flight booking web application built with Next.js and Tailwind CSS.

## Features

- ✅ User registration and login with JWT cookies
- ✅ Flight search with real-time filtering
- ✅ Multi-step booking flow
- ✅ PayStack payment integration
- ✅ User dashboard for bookings
- ✅ Admin panel for flight management
- ✅ Responsive design (mobile-first)
- ✅ Professional animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **API Communication**: Fetch with cookie authentication
- **Forms**: React Hook Form (implied)

## Project Structure
```

## Pages

### Public Pages

- `/` - Homepage with hero section and flight search preview
- `/about` - About page
- `/contact` - Contact page
- `/login` - User login
- `/register` - User registration

### Authenticated Pages

- `/search` - Flight search with filters
- `/booking/[flightId]` - Booking flow (passenger details, seat selection, payment)
- `/bookings` - User's booking history
- `/bookings/[id]` - Booking details

### Admin Pages

- `/admin` - Admin dashboard
- `/admin/flights` - Flight management (CRUD)
- `/admin/bookings` - View all bookings
- `/admin/payments` - View all payments

## API Service Layer

All API calls are centralized in `app/_lib/apiService.js`:

```javascript
// Authentication
authAPI.login({ email, password });
authAPI.register(userData);
authAPI.getCurrentUser();
authAPI.logout();

// Flights
flightAPI.getAllFlights(params);
flightAPI.searchFlights(origin, destination, date, passengers);
flightAPI.getFlight(flightId);

// Bookings
bookingAPI.getMyBookings();
bookingAPI.createBooking(bookingData);
bookingAPI.cancelBooking(bookingId);

// Payments
paymentAPI.initiatePayment(paymentData);
paymentAPI.verifyPayment(reference);
```
