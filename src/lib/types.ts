import type {
  InsertListingSchema,
  ListingSchema,
  LoginSchema,
  GenerateMockListingsInput,
  GenerateMockListingsOutput,
  GetListingsQuery,
  GetListingsOutput,
  GetListingOutput,
  GetListingQuery,
  UpdateListingStatusQuery,
  UpdateListingStatusInput,
  UpdateListingStatusOutput,
  EditListingInput,
  EditListingQuery,
  EditListingOutput,
  DeleteListingOutput,
  DeleteListingQuery,
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

export type GetListingsQueryType = z.infer<typeof GetListingsQuery>;
export type GetListingsOutputType = z.infer<typeof GetListingsOutput>;

export type GetListingQueryType = z.infer<typeof GetListingQuery>;
export type GetListingOutputType = z.infer<typeof GetListingOutput>;

export type UpdateListingStatusQueryType = z.infer<
  typeof UpdateListingStatusQuery
>;
export type UpdateListingStatusInputType = z.infer<
  typeof UpdateListingStatusInput
>;
export type UpdateListingStatusOutputType = z.infer<
  typeof UpdateListingStatusOutput
>;

export type EditListingQueryType = z.infer<typeof EditListingQuery>;
export type EditListingInputType = z.infer<typeof EditListingInput>;
export type EditListingOutputType = z.infer<typeof EditListingOutput>;

export type DeleteListingQueryType = z.infer<typeof DeleteListingQuery>;
export type DeleteListingOutputType = z.infer<typeof DeleteListingOutput>;

// auth schema types
export type LoginSchemaType = z.infer<typeof LoginSchema>;
