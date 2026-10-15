import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import prisma from "@/lib/prisma";
import { ResourceStatus } from "@prisma/client";
import { 
  Compass, 
  Search, 
  Filter, 
  RotateCcw, 
  Users, 
  MapPin, 
  Laptop 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

// Revalidate every 60 seconds — resource catalogue is mostly stable
export const revalidate = 60;


interface ResourcesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    minCapacity?: string;
    location?: string;
  }>;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const { search, category, status, minCapacity, location } = await searchParams;

  // 1. Build where query filter
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = {
      name: { equals: category, mode: "insensitive" },
    };
  }

  if (status && Object.values(ResourceStatus).includes(status as ResourceStatus)) {
    where.status = status as ResourceStatus;
  }

  if (minCapacity && !isNaN(Number(minCapacity))) {
    where.capacity = { gte: Number(minCapacity) };
  }

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  // 2. Fetch resources & categories in parallel
  const [resources, categories] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.resourceCategory.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Campus Resource Catalog</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Campus Facilities
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search and reserve computer labs, lecture theatres, seminar halls, and smart AV equipment.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start md:self-auto shadow-xs">
            Showing <span className="text-blue-600 font-bold">{resources.length}</span> resources
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <form method="GET" action="/resources" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search labs, projectors, rooms..."
                className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                name="category"
                defaultValue={category || ""}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div>
              <select
                name="status"
                defaultValue={status || ""}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Submit & Reset actions */}
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="flex-1 font-semibold">
                Apply Filters
              </Button>
              <Link href="/resources" prefetch={true}>
                <Button type="button" variant="outline" size="sm" title="Reset Filters">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </form>

          {/* Quick Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500 whitespace-nowrap">Quick Category:</span>
            <Link
              href="/resources"
              prefetch={true}
              className={`px-3 py-1 rounded-lg border transition-all ${
                !category
                  ? "bg-blue-50 border-blue-500 text-blue-700 font-bold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/resources?category=${encodeURIComponent(c.name)}`}
                prefetch={true}
                className={`px-3 py-1 rounded-lg border transition-all whitespace-nowrap ${
                  category === c.name
                    ? "bg-blue-50 border-blue-500 text-blue-700 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources Cards Grid */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Resources Found"
            description="We couldn't find any campus facilities matching your current filter criteria. Try resetting your search filters."
            action={
              <Link href="/resources">
                <Button variant="outline" size="sm">
                  Clear All Filters
                </Button>
              </Link>
            }
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
