import { queryOptions, useQuery } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
// QUERIES
import { getListingLog } from "@/lib/queries";
// TYPES
import type { GetListingLogQueryType } from "@/lib/types";

export const getListingLogQueryOptions = (
  query: GetListingLogQueryType,
  headers?: HeadersInit,
) =>
  queryOptions({
    queryKey: queryKeys.getListingLog(query),
    queryFn: () => getListingLog(query, headers),
  });

export const useGetListingLog = (query: GetListingLogQueryType) => {
  return useQuery(getListingLogQueryOptions(query));
};
