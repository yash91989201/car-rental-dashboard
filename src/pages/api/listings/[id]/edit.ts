import { EditListingQuery, EditListingInput } from "@/lib/schema";
import type { EditListingOutputType } from "@/lib/types";
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
import { enforceHandlerMethod } from "@/server/utils";
import { and, eq, isNull } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EditListingOutputType>,
) {
  try {
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

    res.status(200).json({
      success: true,
      message: `Listing for ${updatedListing.carName} edited successfully`,
      data: {
        listing: updatedListing,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Error Occurred",
    });
  }
}
