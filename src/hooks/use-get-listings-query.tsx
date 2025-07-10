import { useRouter } from "next/router";
// TYPES
import type { ParsedUrlQuery } from "querystring";
import type { GetListingsQueryType } from "@/lib/types";

interface DashboardQuery extends ParsedUrlQuery {
  page?: string;
  limit?: string;
  sortBy?: GetListingsQueryType["sortBy"];
  order?: GetListingsQueryType["order"];
}

export function useGetListingsQuery() {
  const router = useRouter();

  const { page, limit, sortBy, order } = router.query as DashboardQuery;
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const currentSortBy = sortBy ?? "createdAt";
  const currentOrder = order ?? "desc";

  const changePage = (newPage: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage, limit },
    });
  };

  const changeLimit = (newLimit: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1, limit: newLimit },
    });
  };

  const changeSortBy = (newSortBy: GetListingsQueryType["sortBy"]) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, sortBy: newSortBy, page: 1 },
    });
  };

  const changeOrder = (newOrder: GetListingsQueryType["order"]) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, order: newOrder, page: 1 },
    });
  };

  return {
    page: currentPage,
    limit: currentLimit,
    sortBy: currentSortBy,
    order: currentOrder,
    changePage,
    changeLimit,
    changeSortBy,
    changeOrder,
  };
}
