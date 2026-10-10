export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar Skeleton Placeholder */}
      <div className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-8 w-28 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <div className="h-5 w-40 bg-blue-100 rounded-full" />
          <div className="h-8 w-72 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 rounded" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs h-72 flex flex-col"
            >
              <div className="h-40 bg-slate-100" />
              <div className="p-5 flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
