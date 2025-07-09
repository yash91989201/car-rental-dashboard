import type { ListingType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const limitString = (str: string, limit = 40) => {
  if (!str) return "";
  if (str.length <= limit) return str;
  return str.slice(0, limit) + "...";
};

export const columns: ColumnDef<ListingType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "carName",
    header: "Car Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p title={row.original.description}>
        {limitString(row.original.description)}
      </p>
    ),
  },
  {
    accessorKey: "owner",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Listing Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: "Submitted At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated At",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
  },
];
