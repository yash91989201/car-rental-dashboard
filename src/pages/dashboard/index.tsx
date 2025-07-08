import React from "react";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";

export default function DashboardPage() {
  const { mutate: generateMockListings, isPending } = useGenerateMockListings();

  return (
    <div>
      <h1>Dashboard</h1>
      <button
        onClick={() => generateMockListings({ count: 10 })}
        disabled={isPending}
      >
        {isPending ? "Generating..." : "Generate Mock Listings"}
      </button>
    </div>
  );
}
