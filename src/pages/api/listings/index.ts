import { and, asc, countDistinct, desc, eq, isNull } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
// UTILS
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  handleApiError,
} from "@/server/utils";
// DB TABLES
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
// SCHEMAS
import { GetListingsQuery } from "@/lib/schema";
// TYPES
import type { GetListingsOutputType } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingsOutputType>,
) {
  try {
    await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("GET");

    const { limit, order, page, sortBy, status } = GetListingsQuery.parse(
      req.query,
    );

    const offset = (page - 1) * limit;

    let sortByColumn;

    switch (sortBy) {
      case "carName":
        sortByColumn = listing.carName;
        break;
      case "owner":
        sortByColumn = listing.owner;
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
      .where(
        and(
          status !== "all" ? eq(listing.status, status) : undefined,
          isNull(listing.deletedAt),
        ),
      );

    if (!listingsCount) {
      throw new Error("Failed to get total listings count");
    }

    const totalListings = listingsCount.count;

    const listings = await db
      .select()
      .from(listing)
      .where(
        and(
          status !== "all" ? eq(listing.status, status) : undefined,
          isNull(listing.deletedAt),
        ),
      )
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
        listings,
      },
    });
  } catch (error) {
    console.error("Error on /api/listings : ", error);

    handleApiError(res, error);
  }
}
