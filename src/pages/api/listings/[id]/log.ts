import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
// UTILS
import {
  enforceHandlerMethod,
  enforceHandlerSession,
  handleApiError,
} from "@/server/utils";
// DB TABLES
import { db } from "@/server/db";
import { auditLog } from "@/server/db/schema";
// SCHEMAS
import { GetListingLogQuery } from "@/lib/schema";
// TYPES
import type { GetListingLogOutputType } from "@/lib/types";

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
      orderBy: (auditLog, { desc }) => [desc(auditLog.createdAt)],
      with: {
        admin: true,
      },
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
