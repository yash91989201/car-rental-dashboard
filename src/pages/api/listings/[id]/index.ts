import type { NextApiRequest, NextApiResponse } from "next";
import { and, eq, isNull } from "drizzle-orm";
// UTILS
import { db } from "@/server/db";
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  handleApiError,
} from "@/server/utils";
// DB TABLES
import { listing } from "@/server/db/schema";
// SCHEMAS
import { GetListingQuery } from "@/lib/schema";
// TYPES
import type { GetListingOutputType } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingOutputType>,
) {
  try {
    await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("GET");

    const queries = GetListingQuery.parse(req.query);

    const existingListing = await db.query.listing.findFirst({
      where: and(eq(listing.id, queries.id), isNull(listing.deletedAt)),
    });

    if (!existingListing) {
      throw new Error("Listing not found");
    }

    res.status(200).json({
      success: true,
      message: "Listing fetched successfully",
      data: {
        listing: existingListing,
      },
    });
  } catch (error) {
    console.error("Error on /api/listings/[id] : ", error);

    handleApiError(res, error);
  }
}
