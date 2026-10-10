"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  Building2, 
  CalendarDays, 
  Compass, 
  LayoutDashboard, 
  LogOut, 
  User, 
  ShieldCheck, 
  Bell 
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = session?.user?.role;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" prefetch={true} className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  SmartCampus
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    v1.0
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium -mt-1">
                  Resource Booking & Demand AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-1 ml-8">
              <Link
                href="/resources"
                prefetch={true}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                Explore Resources
              </Link>

              {session && (
                <>
                  <Link
                    href={role === "ADMIN" ? "/admin" : "/dashboard"}
                    prefetch={true}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {role === "ADMIN" ? "Admin Portal" : "My Dashboard"}
                  </Link>

                  <Link
                    href="/bookings"
                    prefetch={true}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <CalendarDays className="w-4 h-4" />
                    My Bookings
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? (
              <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-lg" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/notifications"
                  prefetch={true}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {session.user?.name}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 flex items-center justify-end gap-1">
                      {role === "ADMIN" && <ShieldCheck className="w-3 h-3 text-amber-600" />}
                      {role}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  prefetch={true}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  prefetch={true}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:shadow"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/resources"
            prefetch={true}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Explore Resources
          </Link>
          {session ? (
            <>
              <Link
                href={role === "ADMIN" ? "/admin" : "/dashboard"}
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                {role === "ADMIN" ? "Admin Portal" : "My Dashboard"}
              </Link>
              <Link
                href="/bookings"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                My Bookings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md"
              >
                Sign Out ({session.user?.name})
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                href="/login"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-center text-slate-700 bg-slate-100 rounded-md"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
