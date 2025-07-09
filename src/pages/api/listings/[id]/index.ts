import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { GetListingQuery } from "@/lib/schema";
import type { GetListingOutputType } from "@/lib/types";
import { enforceHandlerMethod } from "@/server/utils";
import { and, eq, isNull } from "drizzle-orm";
import { listing } from "@/server/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingOutputType>,
) {
  try {
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
