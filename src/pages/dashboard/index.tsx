import React from "react";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
import { useGetListings } from "@/hooks/use-get-listings";
import { useUpdateListingStatus } from "@/hooks/use-update-listing-status";
import { Badge } from "@/components/ui/badge";
import type { ListingStatusType } from "@/lib/types";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data, isPending } = useGetListings({});
  const { mutate: generateMockListings } = useGenerateMockListings();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateListingStatus();

  const handleStatusUpdate = (id: string, status: ListingStatusType) => {
    updateStatus({
      query: { id },
      input: { status },
    });
  };

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
              <div className="my-2 flex items-center gap-2">
                <span>Status:</span>
                <Badge
                  variant={
                    listing.status === "approved"
                      ? "default"
                      : listing.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {listing.status}
                </Badge>
              </div>
              <p>Created At: {new Date(listing.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(listing.updatedAt).toLocaleString()}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(listing.id, "approved")}
                  disabled={isUpdating || listing.status === "approved"}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  onClick={() => handleStatusUpdate(listing.id, "rejected")}
                  disabled={isUpdating || listing.status === "rejected"}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
              <div className="flex gap-3">
                <Link href={`/dashboard/${listing.id}`}>Review</Link>
                <Link href={`/dashboard/${listing.id}/edit`}>Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
