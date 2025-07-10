import type { NextApiRequest, NextApiResponse } from "next";
// UTILS
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  generateMockListings,
  handleApiError,
} from "@/server/utils";
// DB TABLES
import { listing } from "@/server/db/schema";
import { db } from "@/server/db";
// SCHEMAS
import { GenerateMockListingsInput } from "@/lib/schema";
// TYPES
import type { GenerateMockListingsOutputType } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateMockListingsOutputType>,
) {
  try {
    await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("POST");

    const { count } = GenerateMockListingsInput.parse(req.body);

    const mockListings = generateMockListings(count);

    const listings = await db.insert(listing).values(mockListings).returning();

    res.status(201).json({
      success: true,
      message: "Mock listings generated successfully",
      data: {
        listings,
      },
    });
  } catch (error) {
    console.error("Error on /api/listings/mock : ", error);

    handleApiError(res, error);
  }
}
