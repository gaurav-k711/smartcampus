import Navbar from "@/components/Navbar";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <div className="h-5 w-36 bg-blue-100 rounded-full" />
          <div className="h-8 w-60 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 rounded" />
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="w-8 h-8 rounded-lg bg-slate-100" />
              </div>
              <div className="h-8 w-16 bg-slate-200 rounded-lg" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64" />
          </div>
          <div className="space-y-4">
            <div className="h-6 w-36 bg-slate-200 rounded" />
            <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64" />
          </div>
        </div>
      </main>
    </div>
  );
}
