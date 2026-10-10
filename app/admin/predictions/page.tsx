import prisma from "@/lib/prisma";
import { predictResourceDemand } from "@/lib/services/demandForecaster";
import DemandMatrixClient from "@/components/admin/DemandMatrixClient";
import { Sparkles } from "lucide-react";

// Predictions are computed at request time but cached for 30 seconds
export const revalidate = 30;


export default async function AdminPredictionsPage() {
  const todayISO = new Date().toISOString().split("T")[0];

  const allResources = await prisma.resource.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  const initialPredictions = await Promise.all(
    allResources.map(async (r) => {
      const pred = await predictResourceDemand(r.id, todayISO, "10:00-12:00");
      return {
        resource: {
          id: r.id,
          name: r.name,
          location: r.location,
          capacity: r.capacity,
          status: r.status,
          category: r.category.name,
        },
        prediction: pred,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Demand Forecasting Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explainable historical AI model projecting timeslot congestion, peak load probabilities, and resource bottlenecks.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Monitored Facilities: <strong className="text-indigo-600">{allResources.length}</strong>
        </div>
      </div>

      <DemandMatrixClient
        initialPredictions={initialPredictions}
        currentDate={todayISO}
      />
    </div>
  );
}
