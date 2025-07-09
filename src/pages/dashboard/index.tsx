import React from "react";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
import { useGetListings } from "@/hooks/use-get-listings";
import { ListingTable } from "@/components/listing-table";
import { ListingTableSkeleton } from "@/components/listing-table/listing-table-skeleton";
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
import { useGetListingsQuery } from "@/hooks/use-get-listings-query";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const router = useRouter();
  const { page, limit, sortBy, order } = useGetListingsQuery();

  const { data, isPending } = useGetListings({
    page,
    limit,
    sortBy,
    order,
  });

  const { mutate: generateMockListings, isPending: isGeneratingMockListings } =
    useGenerateMockListings();

  const totalPages = data?.pagination?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage, limit },
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
                Page Size: {limit} <ChevronDown className="ml-2 h-4 w-4" />
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
        <ListingTableSkeleton rows={limit} />
      ) : (
        <>
          <ListingTable listings={data?.data?.listings ?? []} />
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page === 1 ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
              {[...Array<number>(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(i + 1)}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page === totalPages
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
