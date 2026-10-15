"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Building2, RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console in production for diagnostics
    console.error("[Global Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Something Went Wrong</h1>
        <p className="mt-3 text-slate-500 text-sm leading-relaxed">
          An unexpected error occurred. This has been logged and our team will look into it.
          You can try again or return to the homepage.
        </p>

        {/* Error digest for support reference */}
        {error.digest && (
          <p className="mt-3 text-xs text-slate-400 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Branding */}
        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <Building2 className="w-4 h-4" />
          <span className="text-xs font-medium">SmartCampus</span>
        </div>
      </div>
    </div>
  );
}
