import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  Layers, 
  CalendarCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  ShieldAlert 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
export const dynamic = "force-dynamic";

// 15-second revalidation — admin dashboard needs near-real-time data


export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalResources,
    totalBookings,
    pendingApprovals,
    recentBookings,
    resourcesWithCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resource.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, department: true } },
        resource: { select: { name: true, location: true } },
      },
    }),
    prisma.resource.findMany({
      take: 5,
      include: {
        _count: {
          select: { bookings: true },
        },
        category: true,
      },
      orderBy: {
        bookings: {
          _count: "desc",
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Governance Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time infrastructure oversight, reservation approvals, and facility distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/resources/new" prefetch={true}>
            <Button size="sm" className="font-semibold shadow-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Facility
            </Button>
          </Link>
          <Link href="/admin/bookings" prefetch={true}>
            <Button variant="outline" size="sm" className="font-semibold">
              <CalendarCheck className="w-4 h-4 mr-1.5 text-blue-600" />
              Review Approvals ({pendingApprovals})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Facilities
            </CardTitle>
            <Layers className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900">{totalResources}</div>
            <p className="text-[11px] text-slate-500 mt-1">Across 6 academic categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Reservations
            </CardTitle>
            <Clock className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-indigo-600">{totalBookings}</div>
            <p className="text-[11px] text-slate-500 mt-1">Historical and upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Approvals
            </CardTitle>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-amber-600">{pendingApprovals}</div>
            <p className="text-[11px] text-slate-500 mt-1">Requires admin sign-off</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Registered Accounts
            </CardTitle>
            <Users className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900">{totalUsers}</div>
            <p className="text-[11px] text-slate-500 mt-1">Faculty & Student profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Recent Bookings & Most Utilized Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Reservations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Recent Booking Submissions
            </h2>
            <Link
              href="/admin/bookings"
              prefetch={true}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {b.resource.name}
                      </span>
                      <Badge
                        variant={
                          b.status === "APPROVED"
                            ? "success"
                            : b.status === "PENDING"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {b.user.name} ({b.user.department}) • <span className="font-mono text-slate-700">{b.date} ({b.startTime}-{b.endTime})</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Most Booked Facilities */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Highest Demand Facilities
            </h2>
            <Link
              href="/admin/analytics"
              prefetch={true}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            {resourcesWithCount.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block line-clamp-1">
                      {r.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {r.category.name} • Cap: {r.capacity}
                    </span>
                  </div>
                </div>

                <Badge variant="secondary" className="font-mono">
                  {r._count.bookings} Bookings
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
