import { z } from "zod";
import { ResourceStatus } from "@prisma/client";

export const resourceSchema = z.object({
  name: z.string().min(2, "Resource name must be at least 2 characters"),
  categoryId: z.string().min(1, "Please select a valid resource category"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  location: z.string().min(2, "Location is required"),
  capacity: z.coerce.number().int().positive("Capacity must be greater than 0"),
  status: z.nativeEnum(ResourceStatus).default(ResourceStatus.AVAILABLE),
  requiresApproval: z.boolean().default(false),
  imageUrl: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
