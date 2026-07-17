import type { Metadata } from "next";

import { Toaster } from "react-hot-toast";


import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Event Application",
  description:
    "Event Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          {children}
          {/* <Toaster position="top-right"/> */}
          <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      fontSize: "18px",
      padding: "18px 22px",
      minWidth: "420px",
      borderRadius: "14px",
      fontWeight: "600",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    },
    success: {
      style: {
        background: "#16a34a",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#16a34a",
      },
    },
    error: {
      style: {
        background: "#dc2626",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#dc2626",
      },
    },
  }}
/>
        </AuthProvider>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}