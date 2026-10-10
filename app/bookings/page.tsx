import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MyBookingsClient from "@/components/bookings/MyBookingsClient";
import { CalendarDays, Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/bookings");
  }

  const userBookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      resource: {
        include: {
          category: true,
        },
      },
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Reservation History</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Campus Reservations
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your active, pending, past, and cancelled facility bookings.
            </p>
          </div>

          <Link href="/resources" prefetch={true}>
            <Button size="sm" className="font-semibold shadow-xs">
              <Compass className="w-4 h-4 mr-1.5" />
              Book New Resource
            </Button>
          </Link>
        </div>

        {/* Tabbed Bookings Table */}
        <MyBookingsClient initialBookings={userBookings} />
      </main>

      <Footer />
    </div>
  );
}
