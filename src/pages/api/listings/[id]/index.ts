import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { GetListingQuery } from "@/lib/schema";
import type { GetListingOutputType } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingOutputType>,
) {
  try {
    if (req.method !== "GET") {
      throw new Error(`${req.method} method not allowed`);
    }

    const queries = GetListingQuery.parse(req.query);

    const listing = await db.query.listing.findFirst({
      where: (listing, { eq }) => eq(listing.id, queries.id),
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    res.status(200).json({
      success: true,
      message: "Listing fetched successfully",
      data: {
        listing,
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
