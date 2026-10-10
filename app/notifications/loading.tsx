import Navbar from "@/components/Navbar";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="pb-6 border-b border-slate-200 space-y-2">
          <div className="h-5 w-36 bg-blue-100 rounded-full" />
          <div className="h-8 w-60 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 rounded" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
              </div>
              <div className="h-4 w-20 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
