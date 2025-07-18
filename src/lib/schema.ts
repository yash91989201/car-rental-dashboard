import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// DB TABLES
import { auditLog, listing, users } from "@/server/db/schema";
// TYPES
import type { ListingStatusType } from "./types";

// DB TABLE SCHEMAS
export const UserSchema = createSelectSchema(users);

export const InsertListingSchema = createInsertSchema(listing);
export const UpdateListingSchema = createInsertSchema(listing);
export const ListingSchema = createSelectSchema(listing).extend({
  status: z.enum(["pending", "approved", "rejected"]),
});

export const AuditLogSchema = createSelectSchema(auditLog);

// API SCHEMAS
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
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  sortBy: z
    .enum(["createdAt", "updatedAt", "carName", "owner"])
    .default("createdAt")
    .catch("createdAt"),
  order: z.enum(["asc", "desc"]).default("asc").catch("desc"),
  status: z
    .enum(["all", "pending", "approved", "rejected"])
    .default("all")
    .catch("all"),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(1),
  totalPages: z.number().min(1).default(1),
});

export const GetListingsOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  pagination: z.object({
    page: z.number(),
    totalPages: z.number(),
  }),
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

export const DeleteListingQuery = z.object({
  id: z.cuid2(),
});

export const DeleteListingOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      listing: ListingSchema,
    })
    .optional(),
});

export const GetListingLogQuery = z.object({
  id: z.cuid2(),
});

export const GetListingLogOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      logs: z.array(
        AuditLogSchema.extend({
          admin: UserSchema,
        }),
      ),
    })
    .optional(),
});

// AUTH SCHEMAS
export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
