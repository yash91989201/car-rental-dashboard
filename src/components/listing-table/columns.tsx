import Link from "next/link";
// UTILS
import { buttonVariants } from "@/components/ui/button";
import { cn, getBadgeColor, truncateTextWithEllepsis } from "@/lib/utils";
// TYPES
import type { ListingType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
// UI
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// ICONS
import { Eye, SquarePen, Trash2 } from "lucide-react";

type ColumnProps = {
  approveListing: (id: string) => void;
  rejectListing: (id: string) => void;
  deleteListing: (id: string) => void;
};

export const getColumns = ({
  approveListing,
  rejectListing,
  deleteListing,
}: ColumnProps): ColumnDef<ListingType>[] => [
  {
    accessorKey: "carName",
    header: "Car Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p title={row.original.description}>
        {truncateTextWithEllepsis(row.original.description)}
      </p>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "status",
    header: "Listing Status",
    cell: ({ row }) => (
      <Badge variant="default" className={getBadgeColor(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Submitted On",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    accessorKey: "editStatus",
    header: "Update Status",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="border-green-300 bg-green-100 text-green-800 hover:bg-green-200"
            disabled={
              row.original.status !== "rejected" &&
              row.original.status !== "pending"
            }
            onClick={() => approveListing(row.original.id)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            className="border-red-300 bg-red-100 text-red-800 hover:bg-red-200"
            disabled={
              row.original.status !== "approved" &&
              row.original.status !== "pending"
            }
            onClick={() => rejectListing(row.original.id)}
          >
            Reject
          </Button>
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="invisible flex items-center gap-3 group-hover:visible">
          <Link
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "icon",
              }),
              "border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            )}
            href={`/dashboard/${row.original.id}`}
            title={"View listing"}
          >
            <Eye className="size-4.5" />
          </Link>
          <Link
            href={`/dashboard/${row.original.id}/edit`}
            title="Edit listing Details"
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "icon",
              }),
              "border-sky-300 bg-sky-100 text-sky-800 hover:bg-sky-200",
            )}
          >
            <SquarePen className="size-4.5" />
          </Link>
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "border-red-300 bg-red-100 text-red-800 hover:bg-red-200",
            )}
            title={"Delete listing (soft delete)"}
            onClick={() => deleteListing(row.original.id)}
          >
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
