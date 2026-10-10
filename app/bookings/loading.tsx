import Navbar from "@/components/Navbar";

export default function BookingsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-blue-100 rounded-full" />
            <div className="h-8 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-80 bg-slate-200 rounded" />
          </div>
          <div className="h-9 w-40 bg-blue-600/30 rounded-lg" />
        </div>

        {/* Tab filters */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 bg-slate-200 rounded-xl" />
          ))}
        </div>

        {/* Booking items */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="h-6 w-52 bg-slate-200 rounded" />
                <div className="h-4 w-72 bg-slate-100 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-24 bg-slate-100 rounded-full" />
                <div className="h-8 w-20 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
