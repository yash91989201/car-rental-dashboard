import { and, eq, isNull } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
// UTILS
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  handleApiError,
} from "@/server/utils";
// DB TABLES
import { db } from "@/server/db";
import { auditLog, listing } from "@/server/db/schema";
// SCHEMAS
import { EditListingQuery, EditListingInput } from "@/lib/schema";
// TYPES
import type { EditListingOutputType } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EditListingOutputType>,
) {
  try {
    const session = await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("PATCH");

    const query = EditListingQuery.parse(req.query);
    const input = EditListingInput.parse(req.body);

    const [updatedListing] = await db
      .update(listing)
      .set(input)
      .where(and(eq(listing.id, query.id), isNull(listing.deletedAt)))
      .returning();

    if (!updatedListing) {
      throw new Error("Listing not found");
    }

    await db.insert(auditLog).values({
      action: "edit",
      adminId: session.user.id,
      listingId: updatedListing.id,
    });

    res.status(200).json({
      success: true,
      message: `Listing for ${updatedListing.carName} edited successfully`,
      data: {
        listing: updatedListing,
      },
    });
  } catch (error) {
    console.error("Error on /api/listings/[id]/edit : ", error);

    handleApiError(res, error);
  }
}
