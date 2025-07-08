import { z } from "zod/v4";
import { listing } from "@/server/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { ListingStatusType } from "./types";

// db tables schema
export const InsertListingSchema = createInsertSchema(listing);
export const ListingSchema = createSelectSchema(listing).extend({
  status: z.enum(["pending", "approved", "rejected"]),
});
export const UpdateListingSchema = createInsertSchema(listing);

// api schema
export const GenerateMockListingsInput = z.object({
  count: z.number(),
});

export const GenerateMockListingsOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      listings: z.array(ListingSchema),
    })
    .optional(),
});

export const GetListingsQuery = z.object({
  page: z.number().optional(),
  count: z.number().optional(),
});

export const GetListingsOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      listings: z.array(ListingSchema),
    })
    .optional(),
});

export const GetListingQuery = z.object({
  id: z.cuid2(),
});

export const GetListingOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      listing: ListingSchema,
    })
    .optional(),
});

export const UpdateListingStatusQuery = z.object({
  id: z.cuid2(),
});

export const UpdateListingStatusInput = z.object({
  status: z.custom<ListingStatusType>(),
});

export const UpdateListingStatusOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      listing: ListingSchema,
    })
    .optional(),
});

export const EditListingQuery = z.object({
  id: z.cuid2(),
});

export const EditListingInput = UpdateListingSchema.pick({
  carName: true,
  description: true,
  owner: true,
});

export const EditListingOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      listing: ListingSchema,
    })
    .optional(),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
