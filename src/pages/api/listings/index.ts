import { GetListingsQuery } from "@/lib/schema";
import type { GetListingsOutputType } from "@/lib/types";
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  handleApiError,
} from "@/server/utils";
import { asc, countDistinct, desc, isNull } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingsOutputType>,
) {
  try {
    await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("GET");

    const { limit, order, page, sortBy } = GetListingsQuery.parse(req.query);

    const offset = (page - 1) * limit;

    let sortByColumn;

    switch (sortBy) {
      case "carName":
        sortByColumn = listing.carName;
        break;
      case "owner":
        sortByColumn = listing.owner;
        break;
      case "status":
        sortByColumn = listing.status;
        break;
      case "updatedAt":
        sortByColumn = listing.updatedAt;
        break;
      default:
        sortByColumn = listing.createdAt;
    }

    const sortOrder = order === "asc" ? asc(sortByColumn) : desc(sortByColumn);

    const [listingsCount] = await db
      .select({ count: countDistinct(listing.id) })
      .from(listing)
      .where(isNull(listing.deletedAt));

    if (!listingsCount) {
      throw new Error("Failed to get total listings count");
    }

    const totalListings = listingsCount.count;

    const listings = await db
      .select()
      .from(listing)
      .where(isNull(listing.deletedAt))
      .orderBy(sortOrder)
      .limit(limit)
      .offset(offset);

    res.status(200).json({
      success: true,
      message: `${listings.length} listings fetched successfully`,
      pagination: {
        page,
        totalPages: Math.ceil(totalListings / limit),
      },
      data: {
        listings: listings.map((listing) => ({
          ...listing,
          createdAt: listing.createdAt.toISOString(),
          updatedAt: listing.updatedAt.toISOString(),
          deletedAt: listing?.deletedAt?.toISOString() ?? null,
        })),
      },
    });
  } catch (error) {
    console.error("Error on /api/listings : ", error);

    handleApiError(res, error);
  }
}
