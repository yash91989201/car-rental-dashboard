import { getListingQueryOptions } from "@/hooks/use-get-listing";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn, getBadgeColor } from "@/lib/utils";
import { useDeleteListing } from "@/hooks/use-delete-listing";
import { useUpdateListingStatus } from "@/hooks/use-update-listing-status";
import { ListingLog } from "@/components/listing-log";

export default function ListingPage() {
  const router = useRouter();
  const { id } = router.query;
  const listingId = Array.isArray(id) ? id[0] : id;

  const { data, isPending } = useQuery({
    ...getListingQueryOptions({ id: listingId! }),
    enabled: !!listingId,
  });

  const { mutateAsync: updateListingStatus } = useUpdateListingStatus();
  const { mutateAsync: deleteListing } = useDeleteListing();

  const approveListing = (id: string) => {
    void updateListingStatus({ query: { id }, input: { status: "approved" } });
  };

  const rejectListing = (id: string) => {
    void updateListingStatus({ query: { id }, input: { status: "rejected" } });
  };

  const listing = data?.data?.listing;

  if (isPending) {
    return (
      <div className="text-muted-foreground flex h-[60vh] items-center justify-center">
        Loading listing details...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-destructive flex h-[60vh] items-center justify-center">
        Listing not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-3xl font-semibold">Listing Details</h1>
        <p className="text-muted-foreground text-sm">
          View full details of the car listing
        </p>
      </div>

      <div className="space-y-2 rounded-md border p-4">
        <div>
          <p className="text-xl font-medium text-gray-900">{listing.carName}</p>
          <p className="text-muted-foreground text-sm">ID: {listing.id}</p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="font-medium text-gray-800">Description: </span>
            <span className="text-gray-600">
              {listing.description || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-800">Owner: </span>
            <span className="text-gray-600">{listing.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">Status: </span>
            <Badge className={getBadgeColor(listing.status)}>
              {listing.status}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-gray-800">Created At: </span>
            <span>{new Date(listing.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium text-gray-800">Last Updated: </span>
            <span>{new Date(listing.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          className="border-green-300 bg-green-100 text-green-800 hover:bg-green-200"
          disabled={
            listing.status !== "rejected" && listing.status !== "pending"
          }
          onClick={() => approveListing(listing.id)}
        >
          Approve
        </Button>

        <Button
          size="sm"
          className="border-red-300 bg-red-100 text-red-800 hover:bg-red-200"
          disabled={
            listing.status !== "approved" && listing.status !== "pending"
          }
          onClick={() => rejectListing(listing.id)}
        >
          Reject
        </Button>

        <Link
          href={`/dashboard/${listing.id}/edit`}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "border-sky-300 bg-sky-100 text-sky-800 hover:bg-sky-200",
          )}
          title="Edit listing"
        >
          Edit
        </Link>

        <Button
          variant="secondary"
          className="border-red-300 bg-red-100 text-red-800 hover:bg-red-200"
          title="Delete listing (soft delete)"
          onClick={() => deleteListing({ id: listing.id })}
        >
          Delete
        </Button>
      </div>

      <ListingLog id={listing.id} />
    </div>
  );
}
