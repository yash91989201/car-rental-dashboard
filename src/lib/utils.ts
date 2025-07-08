import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import type { ListingType } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryKeys = {
  all: ["listings"],
  getListings: (page?: number, limit?: number) => [
    ...queryKeys.all,
    "getListings",
    { page },
    { limit },
  ],
  getListing: (id: string) => [...queryKeys.all, "getListing", { id }],
};

export const generateMockListings = async ({
  count,
}: {
  count: number;
}): Promise<ListingType[]> => {
  const response = await fetch("/api/listings/mock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ count }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as ListingType[];
};
