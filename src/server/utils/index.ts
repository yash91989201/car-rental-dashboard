import { createId } from "@paralleldrive/cuid2";
import type { ListingStatusType, ListingType } from "@/lib/types";
import {
  MOCK_CAR_DESCRIPTIONS,
  MOCK_CAR_NAMES,
  MOCK_OWNER_NAMES,
} from "@/constants";

const statuses: ListingStatusType[] = ["pending", "approved", "rejected"];

function getRandomItem<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("received empty array");
  }

  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomDateWithinLast30Days(): Date {
  const now = new Date();
  const offset = Math.floor(Math.random() * 30); // 0 to 29 days ago
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
      createdAt,
      updatedAt,
    });
  }

  return listings;
}
