import {
  UpdateListingStatusInput,
  UpdateListingStatusQuery,
} from "@/lib/schema";
import type { UpdateListingStatusOutputType } from "@/lib/types";
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
import { enforceHandlerMethod } from "@/server/utils";
import { and, eq, isNull } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateListingStatusOutputType>,
) {
  try {
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

    res.status(200).json({
      success: true,
      message: `${updatedListing.status} listing for ${updatedListing.carName}`,
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
