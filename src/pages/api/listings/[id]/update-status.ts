import { and, eq, isNull } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
// UTILS
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  handleApiError,
} from "@/server/utils";
// DB TABLES
import { auditLog, listing } from "@/server/db/schema";
import { db } from "@/server/db";
// SCHEMAS
import {
  UpdateListingStatusInput,
  UpdateListingStatusQuery,
} from "@/lib/schema";
// TYPES
import type { UpdateListingStatusOutputType } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateListingStatusOutputType>,
) {
  try {
    const session = await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("PATCH");

    const query = UpdateListingStatusQuery.parse(req.query);
    const input = UpdateListingStatusInput.parse(req.body);

    const [updatedListing] = await db
      .update(listing)
      .set({
        status: input.status,
      })
      .where(and(eq(listing.id, query.id), isNull(listing.deletedAt)))
      .returning();

    if (!updatedListing) {
      throw new Error("Listing not found");
    }

    await db.insert(auditLog).values({
      action: input.status === "approved" ? "approve" : "reject",
      adminId: session.user.id,
      listingId: query.id,
    });

    res.status(200).json({
      success: true,
      message: `${updatedListing.status} listing for ${updatedListing.carName}`,
      data: {
        listing: updatedListing,
      },
    });
  } catch (error) {
    console.error("Error in /api/listings/[id]/update-status :", error);

    handleApiError(res, error);
  }
}
