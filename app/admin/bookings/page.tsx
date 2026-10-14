import prisma from "@/lib/prisma";
import AdminBookingsClient from "@/components/admin/AdminBookingsClient";
import { CalendarCheck } from "lucide-react";

// 15-second revalidation — fast enough for admin without hitting DB every click
export const dynamic = "force-dynamic";


export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          department: true,
          role: true,
        },
      },
      resource: {
        include: {
          category: true,
        },
      },
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-blue-600" />
            Reservation Approvals & Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review auditorium requests, confirm pending student submissions, or decline with mandatory justification.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Total Recorded: <strong className="text-blue-600">{bookings.length}</strong>
        </div>
      </div>

      <AdminBookingsClient initialBookings={bookings} />
    </div>
  );
}
