import { queryOptions, useQuery } from "@tanstack/react-query";
import { getListingLog } from "@/lib/queries";
import type { GetListingLogQueryType } from "@/lib/types";
import { queryKeys } from "@/lib/utils";

export const getListingLogQueryOptions = (query: GetListingLogQueryType) =>
  queryOptions({
    queryKey: queryKeys.getListingLog(query),
    queryFn: () => getListingLog(query),
  });

export const useGetListingLog = (query: GetListingLogQueryType) => {
  return useQuery(getListingLogQueryOptions(query));
};
