import Link from "next/link";
import { Users, MapPin, ShieldAlert, ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResourceStatus } from "@prisma/client";

interface ResourceCardProps {
  resource: {
    id: string;
    name: string;
    description: string;
    location: string;
    capacity: number;
    status: ResourceStatus;
    requiresApproval: boolean;
    imageUrl?: string | null;
    category: {
      name: string;
    };
  };
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getStatusBadge = (status: ResourceStatus) => {
    switch (status) {
      case ResourceStatus.AVAILABLE:
        return <Badge variant="success">Available</Badge>;
      case ResourceStatus.MAINTENANCE:
        return <Badge variant="warning">Maintenance</Badge>;
      case ResourceStatus.INACTIVE:
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Thumbnail */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-400">
            <Building2 className="w-10 h-10 opacity-40" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs font-semibold">
            {resource.category.name}
          </Badge>
          {resource.requiresApproval && (
            <Badge className="bg-amber-500/90 text-white shadow-xs backdrop-blur-xs font-semibold">
              Approval Required
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {getStatusBadge(resource.status)}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {resource.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[170px]">{resource.location}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Cap: {resource.capacity}</span>
            </div>
          </div>

          <Link href={`/resources/${resource.id}`} prefetch={true} className="block w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between font-semibold group-hover:border-blue-600 group-hover:text-blue-600 transition-colors"
            >
              <span>View Details & Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
