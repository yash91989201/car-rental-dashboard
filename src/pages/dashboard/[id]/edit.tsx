import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
// UTILS
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// CUSTOM HOOKS
import { getListingQueryOptions } from "@/hooks/use-get-listing";
// UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// CUSTOM COMPONENTS
import {
  EditListingForm,
  EditListingFormSkeleton,
} from "@/components/edit-listing-form";
// ICONS
import { ChevronLeft } from "lucide-react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
};

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
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-3">
            <Button
              size="icon"
              className="rounded-full"
              title="Go Back"
              onClick={() => router.back()}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <h1 className="text-3xl font-semibold">Edit Details</h1>
          </CardTitle>
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
