import { Role, ResourceStatus, BookingStatus, DemandLevel, NotificationType } from "@prisma/client";

export type { Role, ResourceStatus, BookingStatus, DemandLevel, NotificationType };

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
}

export interface ResourceWithCategory {
  id: string;
  name: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description?: string | null;
  };
  description: string;
  location: string;
  capacity: number;
  status: ResourceStatus;
  requiresApproval: boolean;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingWithDetails {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  resourceId: string;
  resource: {
    id: string;
    name: string;
    location: string;
    category: {
      name: string;
    };
  };
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  rejectionReason?: string | null;
  createdAt: Date;
}

export interface PredictionResult {
  demandScore: number;
  demandLevel: DemandLevel;
  confidence: number;
  explanation: string;
}

export interface RecommendationResult {
  resource: ResourceWithCategory;
  score: number;
  reason: string;
  predictedDemand: PredictionResult;
}
