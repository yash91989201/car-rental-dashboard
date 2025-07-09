import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getColumns } from "./columns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { ListingType } from "@/lib/types";
import { useUpdateListingStatus } from "@/hooks/use-update-listing-status";

export const ListingTable = ({ listings }: { listings: ListingType[] }) => {
  const { mutateAsync: updateListingStatus } = useUpdateListingStatus();

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

  const table = useReactTable({
    data: listings,
    columns: getColumns({ approveListing, rejectListing }),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
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
              <TableCell
                colSpan={getColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
