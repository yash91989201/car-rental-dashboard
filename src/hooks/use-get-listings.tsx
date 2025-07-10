import { getListings } from "@/lib/queries";
import type { GetListingsQueryType } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getListingsQueryOptions = (input: GetListingsQueryType) =>
  queryOptions({
    queryKey: queryKeys.getListings(input),
    queryFn: () => getListings(input),
  });

export const useGetListings = (input: GetListingsQueryType) => {
  return useQuery(getListingsQueryOptions(input));
};
