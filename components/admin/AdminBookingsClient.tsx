"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Users, 
  Search, 
  ShieldAlert,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { BookingStatus } from "@prisma/client";

interface AdminBookingItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  rejectionReason?: string | null;
  createdAt: Date | string;
  user: {
    name: string;
    email: string;
    department: string;
    role: string;
  };
  resource: {
    id: string;
    name: string;
    location: string;
    category: { name: string };
  };
}

interface AdminBookingsClientProps {
  initialBookings: AdminBookingItem[];
}

export default function AdminBookingsClient({
  initialBookings,
}: AdminBookingsClientProps) {
  const [bookings, setBookings] = useState<AdminBookingItem[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.user.name.toLowerCase().includes(search.toLowerCase()) ||
      b.user.email.toLowerCase().includes(search.toLowerCase()) ||
      b.resource.name.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: BookingStatus.APPROVED } : b))
        );
      } else {
        alert("Failed to approve booking.");
      }
    } catch (e) {
      alert("Error approving booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedBookingId(id);
    setRejectionReason("Scheduling conflict with mandatory college academic event.");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedBookingId || !rejectionReason.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBookingId
              ? {
                  ...b,
                  status: BookingStatus.REJECTED,
                  rejectionReason: rejectionReason.trim(),
                }
              : b
          )
        );
        setRejectModalOpen(false);
      } else {
        alert("Failed to decline booking.");
      }
    } catch (e) {
      alert("Error declining booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, email, resource, or purpose..."
              className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-slate-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filtered.length}</strong> matching reservations
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">User & Department</th>
                <th className="py-3.5 px-4">Resource & Space</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Purpose / Agenda</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        {b.user.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {b.user.email} • {b.user.department}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        {b.resource.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {b.resource.location}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 block text-xs">
                      {b.date}
                    </span>
                    <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {b.startTime} - {b.endTime}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-slate-700">
                    <p className="line-clamp-2">{b.purpose}</p>
                    {b.status === BookingStatus.REJECTED && b.rejectionReason && (
                      <p className="text-[10px] text-rose-600 mt-1">
                        Reason: {b.rejectionReason}
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant={
                        b.status === BookingStatus.APPROVED
                          ? "success"
                          : b.status === BookingStatus.PENDING
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {b.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {b.status === BookingStatus.PENDING ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="success"
                          className="h-7 text-xs px-2.5"
                          onClick={() => handleApprove(b.id)}
                          disabled={isProcessing}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs px-2.5"
                          onClick={() => openRejectModal(b.id)}
                          disabled={isProcessing}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decline Reason Dialog */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogHeader onClose={() => setRejectModalOpen(false)}>
          <DialogTitle>Decline Reservation Request</DialogTitle>
          <DialogDescription>
            Specify the institutional justification. The user will receive an immediate in-app notice.
          </DialogDescription>
        </DialogHeader>

        <DialogContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Rejection Reason
            </label>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRejectModalOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirmReject}
            isLoading={isProcessing}
          >
            Confirm Decline
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
