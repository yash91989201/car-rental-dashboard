import { getListingQueryOptions } from "@/hooks/use-get-listing";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ListingPage() {
  const router = useRouter();

  const { id } = router.query;
  const listingId = id ? (Array.isArray(id) ? id[0] : id) : undefined;

  const { data, isPending } = useQuery({
    ...getListingQueryOptions({ id: listingId! }),
    enabled: !!listingId,
  });

  const listing = data?.data?.listing;

  if (isPending) {
    return <div>Loading listing details...</div>;
  }

  if (!listing) {
    return <div>Listing not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Listing Details</h1>
      <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="mb-2 text-xl font-semibold">
          Car Name: {listing.carName}
        </h3>
        <p className="mb-1 text-gray-700">ID: {listing.id}</p>
        <p className="mb-1 text-gray-700">Description: {listing.description}</p>
        <p className="mb-1 text-gray-700">Owner: {listing.owner}</p>
        <div className="my-2 flex items-center gap-2">
          <span className="text-gray-700">Status:</span>
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
        <p className="mb-1 text-gray-700">
          Created At: {new Date(listing.createdAt).toLocaleString()}
        </p>
        <p className="mb-1 text-gray-700">
          Updated At: {new Date(listing.updatedAt).toLocaleString()}
        </p>
        <div className="flex gap-3">
          <Link href={`/dashboard/${listing.id}/edit`}>Edit</Link>
        </div>
      </div>
    </div>
  );
}
