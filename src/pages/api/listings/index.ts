import type { GetListingsOutputType } from "@/lib/types";
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingsOutputType>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error(`${req.method} method is not allowed`);
    }

    const listings = await db.query.listing.findMany();

    res.status(200).json({
      success: true,
      data: {
        listings,
      },
      message: "Listings fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    });
  }
}
