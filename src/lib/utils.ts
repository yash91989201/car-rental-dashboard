import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import type { GetListingsInputType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryKeys = {
  all: () => ["listings"],
  getListings: ({ count, page }: GetListingsInputType) => [
    ...queryKeys.all(),
    "getListings",
    { count },
    { page },
  ],
  getListing: (id: string) => [...queryKeys.all(), "getListing", { id }],
};
