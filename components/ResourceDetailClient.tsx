"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Users, 
  Clock, 
  ShieldAlert, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookingModal from "@/components/BookingModal";
import { ResourceStatus, DemandLevel } from "@prisma/client";

interface ResourceDetailClientProps {
  resource: {
    id: string;
    name: string;
    description: string;
    location: string;
    capacity: number;
    status: ResourceStatus;
    requiresApproval: boolean;
    imageUrl?: string | null;
    category: {
      id: string;
      name: string;
    };
    predictions: Array<{
      demandScore: number;
      demandLevel: DemandLevel;
      confidence: number;
      timeSlot: string;
    }>;
  };
  todaySchedule: Array<{
    id: string;
    startTime: string;
    endTime: string;
    purpose: string;
    status: string;
    user: {
      name: string;
      department: string;
    };
  }>;
  recommendedAlternatives: Array<{
    id: string;
    name: string;
    location: string;
    capacity: number;
    status: ResourceStatus;
    requiresApproval: boolean;
    category: { name: string };
  }>;
}

export default function ResourceDetailClient({
  resource,
  todaySchedule,
  recommendedAlternatives,
}: ResourceDetailClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Latest prediction for this resource
  const latestPrediction = resource.predictions[0] || {
    demandScore: 45,
    demandLevel: DemandLevel.MEDIUM,
    confidence: 85,
    timeSlot: "10:00-12:00",
  };

  const getDemandColor = (level: DemandLevel) => {
    switch (level) {
      case DemandLevel.HIGH:
        return "bg-rose-50 border-rose-200 text-rose-800";
      case DemandLevel.MEDIUM:
        return "bg-amber-50 border-amber-200 text-amber-800";
      case DemandLevel.LOW:
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
      default:
        return "bg-slate-50 border-slate-200 text-slate-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Resource Catalog
        </Link>
      </div>

      {/* Hero card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Resource Image */}
          <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[280px] bg-slate-100">
            {resource.imageUrl ? (
              <img
                src={resource.imageUrl}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <Building2 className="w-16 h-16 opacity-30" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className="bg-white/95 text-slate-900 font-bold shadow-xs">
                {resource.category.name}
              </Badge>
              {resource.requiresApproval && (
                <Badge className="bg-amber-500 text-white font-semibold shadow-xs">
                  Requires Coordinator Approval
                </Badge>
              )}
            </div>
          </div>

          {/* Details & Action */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {resource.name}
                </h1>
                <Badge
                  variant={
                    resource.status === ResourceStatus.AVAILABLE
                      ? "success"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {resource.status.toLowerCase()}
                </Badge>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {resource.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Campus Location
                  </span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {resource.location}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Seating Capacity
                  </span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {resource.capacity} Attendees
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Booking Policy
                  </span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {resource.requiresApproval ? "Approval Review" : "Instant Reserve"}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <Button
                size="lg"
                onClick={() => setIsBookingOpen(true)}
                disabled={resource.status !== ResourceStatus.AVAILABLE}
                className="w-full sm:w-auto font-bold shadow-md shadow-blue-500/20"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reserve This Resource
              </Button>

              <span className="text-xs text-slate-500">
                {resource.status === ResourceStatus.AVAILABLE
                  ? "Open for reservations today & upcoming dates."
                  : "Currently unavailable due to maintenance."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: Today's Schedule & Demand Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Schedule (8 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Today's Schedule & Booked Slots
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <Badge
                          variant={slot.status === "APPROVED" ? "success" : "warning"}
                        >
                          {slot.status}
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {slot.purpose}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Reserved by {slot.user.name} ({slot.user.department})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">
                  No reservations booked for today yet!
                </p>
                <p className="text-xs text-slate-500">
                  All morning and afternoon slots are completely open for booking.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Demand Forecast (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Demand Prediction Intelligence
            </h2>
          </div>

          <div className={`p-6 rounded-2xl border shadow-xs ${getDemandColor(latestPrediction.demandLevel)}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">
                Predicted Peak Level
              </span>
              <Badge
                className={`font-bold ${
                  latestPrediction.demandLevel === DemandLevel.HIGH
                    ? "bg-rose-600 text-white"
                    : latestPrediction.demandLevel === DemandLevel.MEDIUM
                    ? "bg-amber-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {latestPrediction.demandLevel} DEMAND
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight">
                  {latestPrediction.demandScore}/100
                </span>
                <span className="text-xs font-semibold opacity-80">
                  Algorithm Confidence: {latestPrediction.confidence}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    latestPrediction.demandLevel === DemandLevel.HIGH
                      ? "bg-rose-600"
                      : latestPrediction.demandLevel === DemandLevel.MEDIUM
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${latestPrediction.demandScore}%` }}
                />
              </div>

              <p className="text-xs leading-relaxed opacity-90 pt-1">
                {latestPrediction.demandLevel === DemandLevel.HIGH
                  ? "Historically, this resource receives frequent reservations during mid-morning and afternoon hours. We advise checking recommended alternatives below if your schedule is flexible."
                  : "Normal historical utilization rate. Booking availability is optimal during typical weekday time slots."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED ALTERNATIVES SECTION */}
      {recommendedAlternatives.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Smart Alternative Recommendations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Equivalent available spaces in the same category with lower expected congestion.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedAlternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {alt.category.name}
                  </Badge>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {alt.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{alt.location}</span>
                    <span>•</span>
                    <span>Cap: {alt.capacity}</span>
                  </div>
                </div>

                <Link href={`/resources/${alt.id}`} className="block w-full">
                  <Button variant="outline" size="sm" className="w-full font-semibold">
                    <span>Switch to this Space</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        resource={resource}
      />
    </div>
  );
}
