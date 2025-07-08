import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import type { GetListingQueryType, GetListingsQueryType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryKeys = {
  all: () => ["listings"],
  getListings: ({ count, page }: GetListingsQueryType) => [
    ...queryKeys.all(),
    "getListings",
    { count },
    { page },
  ],
  getListing: ({ id }: GetListingQueryType) => [
    ...queryKeys.all(),
    "getListing",
    { id },
  ],
};
