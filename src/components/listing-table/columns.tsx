import type { ListingType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { truncateTextWithEllepsis } from "@/lib/utils";
import { Eye, SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
        {truncateTextWithEllepsis(row.original.description)}
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
    cell: ({ row }) => {
      let className = "";
      switch (row.original.status) {
        case "approved":
          className = "bg-green-200 text-green-900";
          break;
        case "pending":
          className = "bg-yellow-200 text-yellow-900";
          break;
        case "rejected":
          className = "bg-red-200 text-red-900";
          break;
        default:
          className = ""; // Default styling or no specific color
          break;
      }
      return (
        <Badge variant="default" className={className}>
          {row.original.status}
        </Badge>
      );
    },
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
  {
    accessorKey: "rowActions",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="invisible flex items-center gap-3 group-hover:visible">
          <Link
            className={buttonVariants({
              variant: "secondary",
              size: "icon",
            })}
            href={`/dashboard/${row.original.id}`}
            title={"View listing details"}
          >
            <Eye className="size-4.5" />
          </Link>
          <Link
            href={`/dashboard/${row.original.id}/edit`}
            title="Edit listing Details"
            className={buttonVariants({
              variant: "secondary",
              size: "icon",
            })}
          >
            <SquarePen className="size-4.5" />
          </Link>
          <Separator orientation="vertical" className="mx-1.5" />
          <Button
            size="sm"
            className="border-green-300 bg-green-100 text-green-800 hover:bg-green-200"
          >
            Accept
          </Button>
          <Button
            size="sm"
            className="border-red-300 bg-red-100 text-red-800 hover:bg-red-200"
          >
            Reject
          </Button>
        </div>
      );
    },
  },
];
