import { GetListingsQuery } from "@/lib/schema";
import type { GetListingsOutputType } from "@/lib/types";
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
import { asc, countDistinct, desc } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingsOutputType>,
) {
  try {
    if (req.method !== "GET") {
      throw new Error(`${req.method} method is not allowed`);
    }

    const { limit, order, page, sortBy } = GetListingsQuery.parse(req.query);

    const offset = (page - 1) * limit;

    const sortByColumn =
      sortBy === "createdAt" ? listing.createdAt : listing.updatedAt;

    const sortOrder = order === "asc" ? asc(sortByColumn) : desc(sortByColumn);

    const [listingsCount] = await db
      .select({ count: countDistinct(listing.id) })
      .from(listing);

    if (!listingsCount) {
      throw new Error("Failed to get total listings count");
    }

    const totalListings = listingsCount.count;

    const listings = await db
      .select()
      .from(listing)
      .orderBy(sortOrder)
      .limit(limit)
      .offset(offset);

    res.status(200).json({
      success: true,
      pagination: {
        page,
        totalPages: Math.ceil(totalListings / limit),
      },
      data: {
        listings,
      },
      message: "Listings fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
      pagination: {
        page: 1,
        totalPages: 1,
      },
    });
  }
}
