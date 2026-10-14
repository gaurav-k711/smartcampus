import prisma from "@/lib/prisma";
import NewResourceFormClient from "@/components/admin/NewResourceFormClient";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";

// Categories rarely change — 30-second revalidation is fine
export const dynamic = "force-dynamic";


export default async function NewResourcePage() {
  const categories = await prisma.resourceCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Resource Inventory
        </Link>
      </div>

      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-blue-600" />
          Add New Campus Facility
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Register a computer lab, seminar hall, classroom, or campus equipment into the centralized booking directory.
        </p>
      </div>

      <NewResourceFormClient categories={categories} />
    </div>
  );
}
