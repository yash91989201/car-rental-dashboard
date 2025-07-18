import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
// UTILS
import { getColumns } from "./columns";
// TYPES
import type { ListingType } from "@/lib/types";
// CUSTOM HOOKS
import { useUpdateListingStatus } from "@/hooks/use-update-listing-status";
import { useDeleteListing } from "@/hooks/use-delete-listing";
// UI
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export const ListingTable = ({ listings }: { listings: ListingType[] }) => {
  const { mutateAsync: updateListingStatus } = useUpdateListingStatus();
  const { mutateAsync: deleteListing } = useDeleteListing();

  const approveListing = (id: string) => {
    void updateListingStatus({
      query: { id },
      input: { status: "approved" },
    });
  };

  const rejectListing = (id: string) => {
    void updateListingStatus({
      query: { id },
      input: { status: "rejected" },
    });
  };

  const deleteListingAction = (id: string) => {
    void deleteListing({ id });
  };

  const table = useReactTable({
    data: listings,
    columns: getColumns({
      approveListing,
      rejectListing,
      deleteListing: deleteListingAction,
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="group"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No listings found!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
