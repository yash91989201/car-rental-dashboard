import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { DeleteListingQuery } from "@/lib/schema";
import type { DeleteListingOutputType } from "@/lib/types";
import { and, eq, isNull } from "drizzle-orm";
import { listing } from "@/server/db/schema";
import { enforceHandlerMethod } from "@/server/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteListingOutputType>,
) {
  try {
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

    res.status(200).json({
      success: true,
      message: `Listing for ${deletedListing.carName} is deleted`,
      data: {
        listing: deletedListing,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
