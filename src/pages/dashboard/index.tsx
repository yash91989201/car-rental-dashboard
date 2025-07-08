import React from "react";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
import { useGetListings } from "@/hooks/use-get-listings";

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
        <div>
          {data?.data?.listings.map((listing) => (
            <div
              key={listing.id}
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h3>CarName: {listing.carName}</h3>
              <p>ID: {listing.id}</p>
              <p>Description: {listing.description}</p>
              <p>Owner: {listing.owner}</p>
              <p>Status: {listing.status}</p>
              <p>Created At: {new Date(listing.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(listing.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
