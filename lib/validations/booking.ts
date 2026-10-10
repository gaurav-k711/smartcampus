import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createBookingSchema = z
  .object({
    resourceId: z.string().min(1, "Resource ID is required"),
    date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
    startTime: z.string().regex(timeRegex, "Start time must be in HH:mm 24-hour format"),
    endTime: z.string().regex(timeRegex, "End time must be in HH:mm 24-hour format"),
    purpose: z.string().min(3, "Please provide a purpose of at least 3 characters"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be strictly before end time",
    path: ["endTime"],
  })
  .refine(
    (data) => {
      const todayISO = new Date().toISOString().split("T")[0];
      return data.date >= todayISO;
    },
    {
      message: "Reservation date cannot be in the past",
      path: ["date"],
    }
  );

export const updateBookingStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CANCELLED"]),
  rejectionReason: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
