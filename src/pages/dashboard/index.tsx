import React from "react";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
import { useGetListings } from "@/hooks/use-get-listings";
import { ListingTable } from "@/components/listing-table";
import { ListingTableSkeleton } from "@/components/listing-table/listing-table-skeleton";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { ChevronDown } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DashboardQuery extends ParsedUrlQuery {
  page?: string;
  limit?: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const { page, limit } = router.query as DashboardQuery;
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;

  const { data, isPending } = useGetListings({
    page: currentPage,
    limit: currentLimit,
    sortBy: "createdAt",
    order: "desc",
  });

  const { mutate: generateMockListings, isPending: isGeneratingMockListings } =
    useGenerateMockListings();

  const totalPages = data?.pagination?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage, limit: currentLimit },
    });
  };

  const handleLimitChange = (newLimit: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1, limit: newLimit },
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={() => generateMockListings({ count: 10 })}
          disabled={isGeneratingMockListings}
        >
          {isGeneratingMockListings
            ? "Generating..."
            : "Generate Mock Listings"}
        </Button>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Page Size: {currentLimit}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 20, 30, 50].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => handleLimitChange(size)}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isPending ? (
        <ListingTableSkeleton rows={currentLimit} />
      ) : (
        <>
          <ListingTable listings={data?.data?.listings ?? []} />
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
              {[...Array<number>(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
