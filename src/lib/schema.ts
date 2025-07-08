import { z } from "zod/v4";
import { listing } from "@/server/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const MockListingReqBodySchema = z.object({
  count: z.number(),
});

export const ListingSchema = createSelectSchema(listing).extend({
  status: z.enum(["pending", "approved", "rejected"]),
});

export const InsertListingSchema = createInsertSchema(listing);

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
