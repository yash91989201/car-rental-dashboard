import { listing } from "@/server/db/schema";
import { db } from "@/server/db";
import { generateMockListings } from "@/server/utils";
import { GenerateMockListingsInput } from "@/lib/schema";
import type { NextApiRequest, NextApiResponse } from "next";
import type { GenerateMockListingsOutputType } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateMockListingsOutputType>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error(`${req.method} not allowed`);
    }

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
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    });
  }
}
