"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  CalendarCheck, 
  Users, 
  BarChart3, 
  Sparkles, 
  Building2, 
  ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    name: "Overview Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Resource Inventory",
    href: "/admin/resources",
    icon: Layers,
  },
  {
    name: "Booking Approvals",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Analytics & Reports",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Demand Forecasts",
    href: "/admin/predictions",
    icon: Sparkles,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between shrink-0 border-r border-slate-800">
      <div className="p-6 space-y-6">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight block">
              SmartCampus
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Admin Governance Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Public Portal */}
      <div className="p-6 border-t border-slate-800">
        <Link
          href="/dashboard"
          prefetch={true}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Student/Faculty View</span>
        </Link>
      </div>
    </aside>
  );
}
