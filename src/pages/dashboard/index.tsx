import React from "react";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
import { useGetListings } from "@/hooks/use-get-listings";
import { ListingTable } from "@/components/listing-table";
import { ListingTableSkeleton } from "@/components/listing-table/listing-table-skeleton";

import { Button } from "@/components/ui/button";
import { useGetListingsQuery } from "@/hooks/use-get-listings-query";
import { TablePagination } from "@/components/listing-table/pagination";

export default function DashboardPage() {
  const { page, limit, sortBy, order, changeLimit, changePage } =
    useGetListingsQuery();

  const { data, isPending } = useGetListings({
    page,
    limit,
    sortBy,
    order,
  });

  const { mutate: generateMockListings, isPending: isGeneratingMockListings } =
    useGenerateMockListings();

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
      </div>

      {isPending ? (
        <ListingTableSkeleton rows={limit} />
      ) : (
        <>
          <ListingTable listings={data?.data?.listings ?? []} />
          <TablePagination
            page={page}
            limit={limit}
            totalPages={data?.pagination?.totalPages ?? 1}
            changePage={changePage}
            changeLimit={changeLimit}
          />
        </>
      )}
    </div>
  );
}
