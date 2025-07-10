import { queryOptions, useQuery } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
// QUERIES
import { getListings } from "@/lib/queries";
// TYPES
import type { GetListingsQueryType } from "@/lib/types";

export const getListingsQueryOptions = (input: GetListingsQueryType) =>
  queryOptions({
    queryKey: queryKeys.getListings(input),
    queryFn: () => getListings(input),
  });

export const useGetListings = (input: GetListingsQueryType) => {
  return useQuery(getListingsQueryOptions(input));
};
