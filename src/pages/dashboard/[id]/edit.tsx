import { getListingQueryOptions } from "@/hooks/use-get-listing";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EditListingForm,
  EditListingFormSkeleton,
} from "@/components/edit-listing-form";

export default function EditListingPage() {
  const router = useRouter();
  const { id } = router.query;
  const listingId = Array.isArray(id) ? id[0] : id;

  const { data, isFetching } = useQuery({
    ...getListingQueryOptions({ id: listingId! }),
    enabled: !!listingId,
  });

  const listing = data?.data?.listing;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching || !listing ? (
            <EditListingFormSkeleton />
          ) : (
            <EditListingForm
              listingId={listingId!}
              defaultValues={{
                carName: listing.carName,
                description: listing.description,
                owner: listing.owner,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
