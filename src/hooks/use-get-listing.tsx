import { queryOptions, useQuery } from "@tanstack/react-query";
import { getListing } from "@/lib/queries";
import type { GetListingQueryType } from "@/lib/types";
import { queryKeys } from "@/lib/utils";

export const getListingQueryOptions = (query: GetListingQueryType) =>
  queryOptions({
    queryKey: queryKeys.getListing(query),
    queryFn: () => getListing(query),
  });

export const useGetListing = (query: GetListingQueryType) => {
  return useQuery(getListingQueryOptions(query));
};
