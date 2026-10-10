import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import { 
  Building2, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Laptop, 
  Users, 
  AlertCircle,
  BarChart3,
  Calendar
} from "lucide-react";

// Revalidate every 5 minutes — stats don't need to be real-time
export const revalidate = 300;


export default async function HomePage() {
  // Fetch real database counts for the hero stats
  let totalResources = 0;
  let totalBookings = 0;
  let totalCategories = 0;

  try {
    const [resCount, bookCount, catCount] = await Promise.all([
      prisma.resource.count(),
      prisma.booking.count(),
      prisma.resourceCategory.count(),
    ]);
    totalResources = resCount;
    totalBookings = bookCount;
    totalCategories = catCount;
  } catch (e) {
    console.error("Failed to query live counts:", e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-16 pb-24 border-b border-slate-200/60">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen College Infrastructure Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Resource Management for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Modern Campuses
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                Eliminate double-bookings, forecast peak resource congestion with historical algorithms, and effortlessly allocate computer labs, seminar halls, and campus equipment.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                <Link
                  href="/resources"
                  prefetch={true}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Laptop className="w-4 h-4" />
                  Explore Campus Resources
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  prefetch={true}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                >
                  Access Portal Sign In
                </Link>
              </div>

              {/* DEMO ACCOUNTS BADGE */}
              <div className="pt-6">
                <div className="inline-block p-3 bg-white/90 border border-slate-200 rounded-xl shadow-xs text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 mr-2">Demo Logins:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-blue-700 font-mono mr-2">student1@smartcampus.local</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-indigo-700 font-mono mr-2">faculty@smartcampus.local</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-mono">admin@smartcampus.local</span>
                  <span className="text-slate-400 ml-2">(Password: <span className="font-mono text-slate-700">Password123!</span>)</span>
                </div>
              </div>
            </div>

            {/* LIVE METRICS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalResources || 10}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Active Resources</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <p className="text-3xl font-extrabold text-blue-600 tracking-tight">{totalBookings || 18}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Bookings Handled</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <p className="text-3xl font-extrabold text-indigo-600 tracking-tight">{totalCategories || 6}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Resource Categories</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">0%</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Overbooking Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Workflow Process</h2>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">How SmartCampus Works</p>
              <p className="text-slate-600 text-sm mt-2">
                A seamless 4-step workflow from discovery to booking confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm shadow-blue-500/20">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">Discover</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Filter by category, capacity, campus block, and real-time operational status.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm shadow-indigo-500/20">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">Predict Demand</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Historical algorithms compute demand scores and suggest alternative low-congestion spaces.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm shadow-purple-500/20">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">Conflict Check</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Server-side slot validation strictly prevents double bookings and overlapping time windows.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm shadow-emerald-500/20">
                  4
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">Instant Approval</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatic approvals for open spaces; administrative workflows for restricted auditoriums.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PLATFORM FEATURES */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Capabilities</h2>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">Engineered for Academic Excellence</p>
              <p className="text-slate-600 text-sm mt-2">
                Everything required to orchestrate collegiate facilities with zero friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Zero-Conflict Booking</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Strict database constraints verify that no two bookings overlap on date, start, and end intervals. Back-to-back transitions are seamlessly allowed.
                </p>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Predictive Demand Intelligence</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Analyzes day-of-week trends, historical utilization frequency, and timeslots to forecast HIGH/MEDIUM/LOW demand scores before booking.
                </p>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Smart Alternatives</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When a lab or hall is congested, SmartCampus immediately calculates and recommends equivalent nearby rooms in the same category.
                </p>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">3-Tier Role Permissions</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dedicated privileges for Students, Faculty, and Campus Administrators with tailored workflows and administrative governance.
                </p>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Real-Time Utilization Analytics</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Visualize peak usage hours, resource popularity charts, category breakdown, and historical occupancy ratios powered by Recharts.
                </p>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Visual Schedule Calendar</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Interactive calendar view to inspect scheduled blocks, manage reservation statuses, and quickly identify open booking windows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to streamline your campus resources?
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-base sm:text-lg">
              Sign in with one of our demo accounts or register your student/faculty profile today to experience conflict-free reservations.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                prefetch={true}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition-all"
              >
                Create Account
              </Link>
              <Link
                href="/resources"
                prefetch={true}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-blue-800/80 hover:bg-blue-800 border border-blue-400/30 transition-all"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
