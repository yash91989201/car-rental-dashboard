import { createId } from "@paralleldrive/cuid2";
import { getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
// UTILS
import { UnauthorizedError } from "./unauthorized-error";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// CONSTANTS
import {
  MOCK_CAR_DESCRIPTIONS,
  MOCK_CAR_NAMES,
  MOCK_OWNER_NAMES,
} from "@/constants";
// TYPES
import type { ListingStatusType, ListingType } from "@/lib/types";

const statuses: ListingStatusType[] = ["pending", "approved", "rejected"];

function getRandomItem<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("received empty array");
  }

  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomDateWithinLast30Days(): Date {
  const now = new Date();
  const offset = Math.floor(Math.random() * 30);
  const randomDate = new Date(now);
  randomDate.setDate(now.getDate() - offset);
  return randomDate;
}

export function generateMockListings(count = 10): ListingType[] {
  const listings: ListingType[] = [];

  for (let i = 0; i < count; i++) {
    const createdAt = getRandomDateWithinLast30Days();
    const updatedAt = new Date(createdAt);
    updatedAt.setDate(createdAt.getDate() + Math.floor(Math.random() * 5));

    listings.push({
      id: createId(),
      carName: getRandomItem(MOCK_CAR_NAMES),
      description: getRandomItem(MOCK_CAR_DESCRIPTIONS),
      owner: getRandomItem(MOCK_OWNER_NAMES),
      status: getRandomItem(statuses),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      deletedAt: null,
    });
  }

  return listings;
}

export const enforceHandlerSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, authOptions);

  if (session === null) {
    throw new UnauthorizedError();
  }

  return session;
};

export function enforceHandlerMethod(req: NextApiRequest) {
  return (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE") => {
    if (req.method !== method) {
      throw new Error(`${req.method} method not allowed`);
    }
  };
}

export function handleApiError(res: NextApiResponse, error: unknown) {
  if (error instanceof Error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({
      success: false,
      message: "Unauthorized, please login before performing this action",
    });
  } else {
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
}
