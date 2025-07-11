import { and, eq, isNull } from "drizzle-orm";
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
import { DeleteListingQuery } from "@/lib/schema";
// TYPES
import type { DeleteListingOutputType } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteListingOutputType>,
) {
  try {
    const session = await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("DELETE");

    const query = DeleteListingQuery.parse(req.query);

    const [deletedListing] = await db
      .update(listing)
      .set({
        deletedAt: new Date(),
      })
      .where(and(eq(listing.id, query.id), isNull(listing.deletedAt)))
      .returning();

    if (!deletedListing) {
      throw new Error("Listing not found or already deleted");
    }

    console.log({
      adminId: session.user.id,
      listingId: query.id,
    });
    await db.insert(auditLog).values({
      action: "delete",
      adminId: session.user.id,
      listingId: query.id,
    });

    res.status(200).json({
      success: true,
      message: `Listing for ${deletedListing.carName} is deleted`,
      data: {
        listing: deletedListing,
      },
    });
  } catch (error) {
    console.error("Error on /api/listings/[id]/delete : ", error);

    handleApiError(res, error);
  }
}
