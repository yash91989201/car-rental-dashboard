import { MockListingReqBodySchema } from "@/lib/schema";
import { generateMockListings } from "@/lib/utils";
import { db } from "@/server/db";
import { listing } from "@/server/db/schema";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const parsedBody = MockListingReqBodySchema.safeParse(req.body);
  const data = parsedBody.data;

  if (!parsedBody.success || !data) {
    res.status(405).end("count is required in body");
    return;
  }

  const mockListings = generateMockListings(data.count);

  const queryRes = await db.insert(listing).values(mockListings).returning();

  res.status(200).json({
    listings: queryRes,
  });
}
