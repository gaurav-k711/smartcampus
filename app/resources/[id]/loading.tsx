import Navbar from "@/components/Navbar";

export default function ResourceDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-48 bg-slate-200 rounded mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 sm:h-96 w-full bg-slate-200 rounded-3xl" />
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="h-8 w-2/3 bg-slate-200 rounded-lg" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-4/5 bg-slate-100 rounded" />
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="h-16 bg-slate-100 rounded-2xl" />
                <div className="h-16 bg-slate-100 rounded-2xl" />
                <div className="h-16 bg-slate-100 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Right Column / Booking card skeleton */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="h-6 w-44 bg-slate-200 rounded-md" />
              <div className="h-12 bg-blue-50 rounded-2xl" />
              <div className="space-y-3">
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
              <div className="h-12 w-full bg-blue-600/30 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
