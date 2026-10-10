"use client";

import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  Award, 
  Layers, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BookingsTrendChart from "@/components/charts/BookingsTrendChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import PeakHoursBarChart from "@/components/charts/PeakHoursBarChart";
import TopResourcesChart from "@/components/charts/TopResourcesChart";

interface AnalyticsData {
  summary: {
    totalBookings: number;
    approvedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalResources: number;
    campusUtilizationRate: number;
  };
  bookingsOverTime: Array<{ date: string; bookings: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  peakHours: Array<{ hour: string; bookings: number }>;
  topResources: Array<{ name: string; count: number; capacity: number }>;
}

export default function AnalyticsDashboardClient({
  data,
}: {
  data: AnalyticsData;
}) {
  const { summary, bookingsOverTime, categoryDistribution, peakHours, topResources } = data;

  return (
    <div className="space-y-8">
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Campus Utilization
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-600">
              {summary.campusUtilizationRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Active reservation capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Reservations
            </CardTitle>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">
              {summary.totalBookings}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Processed by system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Approved Bookings
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600">
              {summary.approvedBookings}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Successfully fulfilled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Facilities
            </CardTitle>
            <Layers className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">
              {summary.totalResources}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Available for allocation</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Trend Over Time & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Weekly Booking Volume Trend
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily reservations created across the prior 7-day rolling window.
              </p>
            </div>
            <Badge variant="secondary">Past 7 Days</Badge>
          </div>
          <BookingsTrendChart data={bookingsOverTime} />
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              Bookings by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Proportional distribution of space demands.
            </p>
          </div>
          <CategoryPieChart data={categoryDistribution} />
        </div>
      </div>

      {/* Row 2: Peak Hours & Most Booked Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Peak Booking Hours Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Concentration of reservations across 08:00 AM – 06:00 PM intervals.
            </p>
          </div>
          <PeakHoursBarChart data={peakHours} />
        </div>

        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Top 5 Most Requested Facilities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative completed and upcoming reservation counts.
            </p>
          </div>
          <TopResourcesChart data={topResources} />
        </div>
      </div>
    </div>
  );
}
