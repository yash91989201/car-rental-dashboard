import { dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import type { GetServerSideProps } from "next";
// SCHEMAS
import { GetListingsQuery } from "@/lib/schema";
// UTILS
import { getQueryClient } from "@/lib/query-client";
import { authOptions } from "../api/auth/[...nextauth]";
// CUSTOM HOOKS
import {
  useGetListings,
  getListingsQueryOptions,
} from "@/hooks/use-get-listings";
import { useGetListingsQuery } from "@/hooks/use-get-listings-query";
import { useGenerateMockListings } from "@/hooks/use-generate-mock-listings";
// UI
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// CUSTOM COMPONENTS
import { UserMenu } from "@/components/user-menu";
import { ListingTable } from "@/components/listing-table";
import { TablePagination } from "@/components/listing-table/pagination";
import { ListingTableSkeleton } from "@/components/listing-table/listing-table-skeleton";
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

  const queryParams = GetListingsQuery.safeParse(context.query);

  if (!queryParams.success) {
    return {
      props: {},
    };
  }

  const queryClient = getQueryClient();
  const cookieHeader = context.req.headers.cookie;

  await queryClient.fetchQuery(
    getListingsQueryOptions(
      queryParams.data,
      cookieHeader ? { cookie: cookieHeader } : undefined,
    ),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function DashboardPage() {
  const { page, limit, sortBy, order, status, updateListingsQuery } =
    useGetListingsQuery();

  const { data, isPending } = useGetListings({
    page,
    limit,
    sortBy,
    order,
    status,
  });

  const { mutate: generateMockListings, isPending: isGeneratingMockListings } =
    useGenerateMockListings();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <UserMenu />
      </div>
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
            <label className="mb-1 block text-xs font-medium">Status</label>
            <Select
              value={status ?? "all"}
              onValueChange={(val) =>
                updateListingsQuery({ status: val as typeof status })
              }
            >
              <SelectTrigger id="status" className="min-w-[120px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Sort By</label>
            <Select
              value={sortBy}
              onValueChange={(val) =>
                updateListingsQuery({ sortBy: val as typeof sortBy })
              }
            >
              <SelectTrigger id="sortBy" className="min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carName">Car Name</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
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
              onValueChange={(val) =>
                updateListingsQuery({ order: val as typeof order })
              }
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
            updateListingsQuery={updateListingsQuery}
          />
        </>
      )}
    </div>
  );
}
