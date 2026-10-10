import prisma from "@/lib/prisma";
import ResourceTableClient from "@/components/admin/ResourceTableClient";
import { Layers } from "lucide-react";

// Resources rarely change — 30-second revalidation is plenty
export const revalidate = 30;


export default async function AdminResourcesPage() {
  const resources = await prisma.resource.findMany({
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Campus Resource Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure facilities, manage operational status, capacity, and reservation permissions.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Total Facilities: <strong className="text-blue-600">{resources.length}</strong>
        </div>
      </div>

      <ResourceTableClient initialResources={resources} />
    </div>
  );
}
