import { useRouter } from "next/router";
// TYPES
import type { ParsedUrlQuery } from "querystring";
import type { GetListingsQueryType } from "@/lib/types";

interface DashboardQuery extends ParsedUrlQuery {
  page?: string;
  limit?: string;
  sortBy?: GetListingsQueryType["sortBy"];
  order?: GetListingsQueryType["order"];
  status?: GetListingsQueryType["status"];
}

export function useGetListingsQuery() {
  const router = useRouter();

  const { page, limit, sortBy, order, status } = router.query as DashboardQuery;
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const currentSortBy = sortBy ?? "createdAt";
  const currentOrder = order ?? "desc";
  const currentStatus = status ?? "all";

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

  const changeStatus = (newStatus?: GetListingsQueryType["status"]) => {
    if (newStatus === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, ...restQuery } = router.query;
      void router.push({
        pathname: router.pathname,
        query: { ...restQuery, page: 1 },
      });
    }
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, status: newStatus, page: 1 },
    });
  };

  return {
    page: currentPage,
    limit: currentLimit,
    sortBy: currentSortBy,
    order: currentOrder,
    status: currentStatus,
    changePage,
    changeLimit,
    changeSortBy,
    changeOrder,
    changeStatus,
  };
}
