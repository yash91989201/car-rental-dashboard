import {
  UpdateListingStatusInput,
  UpdateListingStatusQuery,
} from "@/lib/schema";
import type { UpdateListingStatusOutputType } from "@/lib/types";
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateListingStatusOutputType>,
) {
  try {
    if (req.method !== "PATCH") {
      throw new Error(`${req.method} method not allowed`);
    }

    const query = UpdateListingStatusQuery.parse(req.query);
    const input = UpdateListingStatusInput.parse(req.body);

    const [updatedListing] = await db
      .update(listing)
      .set({
        status: input.status,
      })
      .where(eq(listing.id, query.id))
      .returning();

    if (!updatedListing) {
      throw new Error("Listing not found");
    }

    res.status(200).json({
      success: true,
      message: `Listing with id: ${query.id} updated successfully`,
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
