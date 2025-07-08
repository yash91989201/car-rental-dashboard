import { EditListingQuery, EditListingInput } from "@/lib/schema";
import type { EditListingOutputType } from "@/lib/types";
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EditListingOutputType>,
) {
  try {
    if (req.method !== "PATCH") {
      throw new Error(`${req.method} method not allowed`);
    }

    const query = EditListingQuery.parse(req.query);
    const input = EditListingInput.parse(req.body);

    const [updatedListing] = await db
      .update(listing)
      .set(input)
      .where(eq(listing.id, query.id))
      .returning();

    if (!updatedListing) {
      throw new Error("Listing not found");
    }

    res.status(200).json({
      success: true,
      message: `Listing for ${updatedListing.carName} updated successfully`,
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
