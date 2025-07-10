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

    const parsedBody = GenerateMockListingsInput.safeParse(req.body);
    const data = parsedBody.data;

    if (!parsedBody.success || !data) {
      throw new Error("count is required in req body");
    }

    const mockListings = generateMockListings(data.count);

    const queryRes = await db.insert(listing).values(mockListings).returning();

    res.status(201).json({
      success: true,
      message: "Mock listings generated successfully",
      data: {
        listings: queryRes,
      },
    });
  } catch (error) {
    console.error("Error on /api/listings/mock : ", error);

    handleApiError(res, error);
  }
}
