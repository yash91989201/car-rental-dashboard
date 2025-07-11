import { useRouter } from "next/router";
// UTILS
import { GetListingsQuery } from "@/lib/schema";
// TYPES
import type { GetListingsQueryType } from "@/lib/types";

export function useGetListingsQuery() {
  const router = useRouter();

  const queries = GetListingsQuery.parse(router.query);
  const { page, limit, sortBy, order, status } = queries;

  const buildQueryUrl = (updates: Partial<GetListingsQueryType>) => {
    const searchParams = new URLSearchParams();

    const newQuery = GetListingsQuery.parse({ ...queries, ...updates });

    Object.entries(newQuery).forEach(([key, value]) => {
      searchParams.set(key, String(value));
    });

    const queryString = searchParams.toString();

    const url = queryString
      ? `${router.pathname}?${searchParams}`
      : router.pathname;

    return url;
  };

  const updateListingsQuery = (updates: Partial<GetListingsQueryType>) => {
    const url = buildQueryUrl(updates);
    void router.push(url);
  };

  return {
    page,
    limit,
    sortBy,
    order,
    status,
    updateListingsQuery,
  };
}
