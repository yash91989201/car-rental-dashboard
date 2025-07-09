import React from "react";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
import { useGetListings } from "@/hooks/use-get-listings";
import { ListingTable } from "@/components/listing-table";

export default function DashboardPage() {
  const { data, isPending } = useGetListings({});
  const { mutate: generateMockListings } = useGenerateMockListings();

  return (
    <div>
      <h1>Dashboard</h1>
      <button
        onClick={() => generateMockListings({ count: 10 })}
        disabled={isPending}
      >
        {isPending ? "Generating..." : "Generate Mock Listings"}
      </button>
      {isPending ? (
        "Loading"
      ) : (
        <ListingTable listings={data?.data?.listings ?? []} />
      )}
    </div>
  );
}
