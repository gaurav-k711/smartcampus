import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import TopProgressBar from "@/components/ui/TopProgressBar";

export const metadata: Metadata = {
  title: "SmartCampus | Resource Booking & Demand Prediction",
  description:
    "Intelligent campus resource management, real-time booking conflict prevention, and explainable demand forecasting for colleges and universities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
