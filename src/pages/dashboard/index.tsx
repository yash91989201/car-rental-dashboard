import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
// UTILS
import { authOptions } from "../api/auth/[...nextauth]";
// CUSTOM HOOKS
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
import { useGetListings } from "@/hooks/use-get-listings";
import { useGetListingsQuery } from "@/hooks/use-get-listings-query";
// UI
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// CUSTOM COMPONENTS
import { ListingTable } from "@/components/listing-table";
import { ListingTableSkeleton } from "@/components/listing-table/listing-table-skeleton";
import { TablePagination } from "@/components/listing-table/pagination";
// ICONS
import { LoaderCircle } from "lucide-react";

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

export default function DashboardPage() {
  const {
    page,
    limit,
    sortBy,
    order,
    changeLimit,
    changePage,
    changeSortBy,
    changeOrder,
  } = useGetListingsQuery();

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={() => generateMockListings({ count: 10 })}
          disabled={isGeneratingMockListings}
        >
          {isGeneratingMockListings && (
            <LoaderCircle className="mr-2 size-4.5 animate-spin" />
          )}
          Generate Mock Listings
        </Button>
        <div className="flex items-center gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium">Sort By</label>
            <Select
              value={sortBy}
              onValueChange={(val) => val && changeSortBy(val as typeof sortBy)}
            >
              <SelectTrigger id="sortBy" className="min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carName">Car Name</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="createdAt">Submitted On</SelectItem>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Order</label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={order}
              onValueChange={(val) => val && changeOrder(val as typeof order)}
            >
              <ToggleGroupItem value="asc">Asc</ToggleGroupItem>
              <ToggleGroupItem value="desc">Desc</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
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
