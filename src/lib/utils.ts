import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import type { GetListingQueryType, GetListingsQueryType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
};
