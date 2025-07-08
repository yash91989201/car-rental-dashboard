import { useMutation } from "@tanstack/react-query";
import { generateMockListings } from "@/lib/utils";
import type { ListingType } from "@/lib/types";

export const useGenerateMockListings = () =>
  useMutation<ListingType[], Error, { count: number }>({
    mutationFn: generateMockListings,
  });
