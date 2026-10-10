import Link from "next/link";
import { Building2, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SmartCampus</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent campus resource management, real-time availability orchestration, and explainable demand forecasting for academic institutions.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/resources" prefetch={true} className="hover:text-blue-400 transition-colors">
                  Resource Catalog
                </Link>
              </li>
              <li>
                <Link href="/resources?category=Laboratory" prefetch={true} className="hover:text-blue-400 transition-colors">
                  Computer Labs
                </Link>
              </li>
              <li>
                <Link href="/resources?category=Seminar+Hall" prefetch={true} className="hover:text-blue-400 transition-colors">
                  Seminar Halls
                </Link>
              </li>
              <li>
                <Link href="/resources?category=Classroom" prefetch={true} className="hover:text-blue-400 transition-colors">
                  Lecture Theatres
                </Link>
              </li>
            </ul>
          </div>

          {/* System Roles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/login" prefetch={true} className="hover:text-blue-400 transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/login" prefetch={true} className="hover:text-blue-400 transition-colors">
                  Faculty Workspace
                </Link>
              </li>
              <li>
                <Link href="/admin" prefetch={true} className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Deployment & Tech */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Architecture
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>• Modular Monolith Next.js 14</p>
              <p>• PostgreSQL + Prisma ORM</p>
              <p>• Rule-based Historical AI Predictor</p>
              <p>• AWS EC2 + ALB Ready Statelessness</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartCampus System. Designed for Academic Resource Optimization.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with Next.js, Prisma & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
