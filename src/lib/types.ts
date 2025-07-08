import type {
  InsertListingSchema,
  ListingSchema,
  LoginSchema,
  GenerateMockListingsInput,
  GenerateMockListingsOutput,
  GetListingsInput,
  GetListingsOutput,
} from "@/lib/schema";
import type { z } from "zod/v4";

// db table types
export type ListingType = z.infer<typeof ListingSchema>;
export type InsertListingType = z.infer<typeof InsertListingSchema>;

export type ListingStatusType = "pending" | "approved" | "rejected";

// api input and output types
export type GenerateMockListingsInputType = z.infer<
  typeof GenerateMockListingsInput
>;
export type GenerateMockListingsOutputType = z.infer<
  typeof GenerateMockListingsOutput
>;

export type GetListingsInputType = z.infer<typeof GetListingsInput>;
export type GetListingsOutputType = z.infer<typeof GetListingsOutput>;

// auth schema types
export type LoginSchemaType = z.infer<typeof LoginSchema>;
