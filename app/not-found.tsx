import Link from "next/link";
import { Building2, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Building2 className="w-8 h-8" />
          </div>
        </div>

        {/* 404 */}
        <p className="text-8xl font-black text-slate-900 tracking-tight">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Page Not Found</h1>
        <p className="mt-3 text-slate-500 text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try exploring available campus resources or return to the dashboard.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <Search className="w-4 h-4" />
            Browse Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
