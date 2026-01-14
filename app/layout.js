// import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "./_lib/auth-Context";
import { Navigation } from "./_component/navigation";
import { Footer } from "./_component/footer";
import "./_styles/globals.css";
import { ToastProvider } from "./context/toast-context";

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "SkyBook - Flight Booking System",
  description:
    "Your trusted partner for seamless flight bookings worldwide. Search, book, and manage your flights with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
