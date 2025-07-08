import { getListings } from "@/lib/queries";
import type { GetListingsInputType } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getListingsQueryOptions = (input: GetListingsInputType) =>
  queryOptions({
    queryKey: queryKeys.getListings(input),
    queryFn: () => getListings(input),
  });

export const useGetListings = (input: GetListingsInputType) => {
  return useQuery(getListingsQueryOptions(input));
};
