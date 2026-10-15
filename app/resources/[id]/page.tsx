import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceDetailClient from "@/components/ResourceDetailClient";
import prisma from "@/lib/prisma";
import { ResourceStatus } from "@prisma/client";

// Revalidate every 30 seconds — schedule/availability should be near-real-time
export const revalidate = 30;


interface ResourceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { id } = await params;

  const todayISO = new Date().toISOString().split("T")[0];

  // 1 & 2. Fetch resource details and today's schedule in parallel
  const [resource, todayBookings] = await Promise.all([
    prisma.resource.findUnique({
      where: { id },
      include: {
        category: true,
        predictions: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        resourceId: id,
        date: todayISO,
        status: { in: ["APPROVED", "PENDING"] },
      },
      include: {
        user: {
          select: { name: true, department: true },
        },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  if (!resource) {
    notFound();
  }

  // 3. Fetch recommended alternatives in the same category
  const alternatives = await prisma.resource.findMany({
    where: {
      categoryId: resource.categoryId,
      id: { not: resource.id },
      status: ResourceStatus.AVAILABLE,
    },
    include: { category: true },
    take: 3,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResourceDetailClient
          resource={resource}
          todaySchedule={todayBookings}
          recommendedAlternatives={alternatives}
        />
      </main>

      <Footer />
    </div>
  );
}
