import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Clock, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase,
  Users
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingStatus, DemandLevel, ResourceStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // If administrator, optionally redirect or allow viewing user dashboard
  const user = session.user;
  const todayISO = new Date().toISOString().split("T")[0];

  // Fetch parallel dashboard data
  const [
    todayBookings,
    upcomingBookings,
    availableResourcesCount,
    unreadNotifications,
    highDemandResources,
    recentBookings,
  ] = await Promise.all([
    // Today's bookings for this user
    prisma.booking.findMany({
      where: {
        userId: user.id,
        date: todayISO,
        status: { in: [BookingStatus.APPROVED, BookingStatus.PENDING] },
      },
      include: {
        resource: { include: { category: true } },
      },
      orderBy: { startTime: "asc" },
    }),

    // Upcoming bookings for this user
    prisma.booking.findMany({
      where: {
        userId: user.id,
        date: { gte: todayISO },
        status: { in: [BookingStatus.APPROVED, BookingStatus.PENDING] },
      },
      include: {
        resource: { include: { category: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 4,
    }),

    // Total available facilities
    prisma.resource.count({
      where: { status: ResourceStatus.AVAILABLE },
    }),

    // Unread notifications for this user
    prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    // High demand facilities forecast
    prisma.demandPrediction.findMany({
      where: { demandLevel: DemandLevel.HIGH },
      include: {
        resource: {
          select: {
            id: true,
            name: true,
            location: true,
            capacity: true,
            status: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
      take: 3,
    }),

    // User's recent bookings history
    prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        resource: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs">
                {user.role === "FACULTY" ? (
                  <Briefcase className="w-3.5 h-3.5" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5" />
                )}
                <span>
                  {user.role} Portal • {user.department}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Review your reserved spaces for today, plan ahead for upcoming labs, and check live facility demand forecasts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/resources" prefetch={true}>
                <Button className="font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md">
                  <Compass className="w-4 h-4 mr-2" />
                  Explore Resources
                </Button>
              </Link>
              <Link href="/bookings" prefetch={true}>
                <Button
                  variant="outline"
                  className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  My Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Today's Bookings
              </CardTitle>
              <Clock className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-slate-900">
                {todayBookings.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Scheduled for {todayISO}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Upcoming Bookings
              </CardTitle>
              <CalendarDays className="w-4 h-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-indigo-600">
                {upcomingBookings.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Active & pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Available Resources
              </CardTitle>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-emerald-600">
                {availableResourcesCount}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Open campus spaces
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Demand Alerts
              </CardTitle>
              <Sparkles className="w-4 h-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-rose-600">
                {highDemandResources.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Congested peak facilities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Grid: Today & Upcoming vs Demand Forecast & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Schedules (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Today's Schedule Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Your Schedule Today ({todayISO})
                </h2>
                <Badge variant="secondary">{todayBookings.length} slots</Badge>
              </div>

              {todayBookings.length > 0 ? (
                <div className="space-y-3">
                  {todayBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {b.resource.name}
                          </span>
                          <Badge
                            variant={
                              b.status === BookingStatus.APPROVED
                                ? "success"
                                : "warning"
                            }
                          >
                            {b.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {b.resource.location} • <strong className="text-slate-800">{b.purpose}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {b.startTime} - {b.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    You have no scheduled bookings for today.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Need a workstation or meeting room? Reserve in seconds.
                  </p>
                  <Link href="/resources" prefetch={true} className="inline-block pt-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Browse Open Facilities
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Upcoming Reservations List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-600" />
                  Upcoming Reservations
                </h2>
                <Link
                  href="/bookings"
                  prefetch={true}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {upcomingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-900 block">
                          {b.resource.name}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {b.date} • {b.startTime} - {b.endTime} • {b.purpose}
                        </p>
                      </div>

                      <Badge
                        variant={
                          b.status === BookingStatus.APPROVED
                            ? "success"
                            : "warning"
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No upcoming bookings.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: High Demand Forecast & Notifications (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* High Demand Warning Alert */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  Congestion & Peak Demand
                </h2>
              </div>

              <div className="space-y-3">
                {highDemandResources.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/70 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-900">
                        {item.resource.name}
                      </span>
                      <Badge className="bg-rose-600 text-white text-[10px]">
                        HIGH {item.demandScore}%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-rose-700 leading-relaxed">
                      Peak demand detected during mid-day slots. Consider booking early or selecting recommended alternative spaces.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* In-App Notifications Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  Recent Alerts & Notices
                </h2>
                <Link
                  href="/notifications"
                  prefetch={true}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>

              {unreadNotifications.length > 0 ? (
                <div className="space-y-2.5">
                  {unreadNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{n.title}</strong>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No unread notifications. You are all caught up!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
