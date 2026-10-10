"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  ArrowRight,
  Trash2,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BookingStatus } from "@prisma/client";

interface BookingItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  rejectionReason?: string | null;
  createdAt: Date | string;
  resource: {
    id: string;
    name: string;
    location: string;
    category: {
      name: string;
    };
  };
}

interface MyBookingsClientProps {
  initialBookings: BookingItem[];
}

export default function MyBookingsClient({ initialBookings }: MyBookingsClientProps) {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "PENDING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const todayISO = new Date().toISOString().split("T")[0];

  // Group bookings by tab criteria
  const upcomingList = bookings.filter(
    (b) => b.status === BookingStatus.APPROVED && b.date >= todayISO
  );

  const pendingList = bookings.filter(
    (b) => b.status === BookingStatus.PENDING
  );

  const completedList = bookings.filter(
    (b) =>
      b.status === BookingStatus.COMPLETED ||
      (b.status === BookingStatus.APPROVED && b.date < todayISO)
  );

  const cancelledList = bookings.filter(
    (b) =>
      b.status === BookingStatus.CANCELLED ||
      b.status === BookingStatus.REJECTED
  );

  const getCurrentList = () => {
    switch (activeTab) {
      case "UPCOMING":
        return upcomingList;
      case "PENDING":
        return pendingList;
      case "COMPLETED":
        return completedList;
      case "CANCELLED":
        return cancelledList;
      default:
        return [];
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setIsCancelling(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b
          )
        );
      } else {
        const err = await res.json();
        alert(err.error || "Failed to cancel booking.");
      }
    } catch (e) {
      alert("Network error while cancelling.");
    } finally {
      setIsCancelling(null);
    }
  };

  const currentList = getCurrentList();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "UPCOMING"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Upcoming Reservations</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-mono">
            {upcomingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("PENDING")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "PENDING"
              ? "border-amber-600 text-amber-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Pending Approvals</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-mono">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "COMPLETED"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Past & Completed</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono">
            {completedList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CANCELLED")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "CANCELLED"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Cancelled / Declined</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-mono">
            {cancelledList.length}
          </span>
        </button>
      </div>

      {/* Bookings List */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {booking.resource.category.name}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                      {booking.resource.name}
                    </h3>
                  </div>

                  <Badge
                    variant={
                      booking.status === BookingStatus.APPROVED
                        ? "success"
                        : booking.status === BookingStatus.PENDING
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>

                {/* Details grid */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{booking.date}</span>
                    <span className="text-slate-400">•</span>
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-mono text-slate-800">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{booking.resource.location}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <strong className="text-slate-900 block text-[11px] mb-0.5">Purpose:</strong>
                    {booking.purpose}
                  </div>

                  {booking.status === BookingStatus.REJECTED && booking.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <strong className="text-rose-900 block text-[11px] mb-0.5">
                        Decline Reason:
                      </strong>
                      {booking.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/resources/${booking.resource.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Facility Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {(booking.status === BookingStatus.APPROVED ||
                  booking.status === BookingStatus.PENDING) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(booking.id)}
                    disabled={isCancelling === booking.id}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} bookings`}
          description="You do not have any reservations under this classification."
          action={
            <Link href="/resources">
              <Button size="sm" className="font-semibold">
                <Compass className="w-4 h-4 mr-1.5" />
                Explore & Reserve Facilities
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
