import type {
  InsertListingSchema,
  ListingSchema,
  LoginSchema,
} from "@/lib/schema";
import type { z } from "zod/v4";

export type ListingType = z.infer<typeof ListingSchema>;
export type InsertListingType = z.infer<typeof InsertListingSchema>;

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export type ListingStatusType = "pending" | "approved" | "rejected";
