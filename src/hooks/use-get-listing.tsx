import { queryOptions, useQuery } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
// QUERIES
import { getListing } from "@/lib/queries";
// TYPES
import type { GetListingQueryType } from "@/lib/types";

export const getListingQueryOptions = (query: GetListingQueryType) =>
  queryOptions({
    queryKey: queryKeys.getListing(query),
    queryFn: () => getListing(query),
  });

export const useGetListing = (query: GetListingQueryType) => {
  return useQuery(getListingQueryOptions(query));
};
