import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// TYPES
import type {
  GetListingLogQueryType,
  GetListingQueryType,
  GetListingsQueryType,
} from "@/lib/types";
import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBadgeColor(action: string): string {
  switch (action) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approve":
      return "bg-green-100 text-green-800 border border-green-200";
    case "reject":
      return "bg-red-100 text-red-800 border border-red-200";
    case "approved":
      return "bg-green-100 text-green-800 border border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border border-red-200";
    case "edit":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "delete":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "";
  }
}

export const queryKeys = {
  all: () => ["listings"],
  getListings: ({ limit, order, page, sortBy }: GetListingsQueryType) => [
    ...queryKeys.all(),
    "getListings",
    { limit },
    { order },
    { page },
    { sortBy },
  ],
  getListing: ({ id }: GetListingQueryType) => [
    ...queryKeys.all(),
    "getListing",
    { id },
  ],
  getListingLog: ({ id }: GetListingLogQueryType) => [
    ...queryKeys.all(),
    "getListingLog",
    { id },
  ],
};

export const truncateTextWithEllepsis = (str: string, limit = 40) => {
  if (!str) return "";
  if (str.length <= limit) return str;
  return str.slice(0, limit) + "...";
};
