import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { GetListingLogQuery } from "@/lib/schema";
import type { GetListingLogOutputType } from "@/lib/types";
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  handleApiError,
} from "@/server/utils";
import { eq } from "drizzle-orm";
import { auditLog } from "@/server/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetListingLogOutputType>,
) {
  try {
    await enforceHandlerSession(req, res);
    enforceHandlerMethod(req)("GET");

    const queries = GetListingLogQuery.parse(req.query);

    const auditLogs = await db.query.auditLog.findMany({
      where: eq(auditLog.listingId, queries.id),
    });

    res.status(200).json({
      success: true,
      message: "Listing fetched successfully",
      data: {
        logs: auditLogs,
      },
    });
  } catch (error) {
    console.error("Error in /api/listings/[id]/log :", error);

    handleApiError(res, error);
  }
}
