// UI
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const ListingTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  const columns = [
    { key: "id", header: "ID", width: "w-24" },
    { key: "carName", header: "Car Name", width: "w-32" },
    { key: "description", header: "Description", width: "w-32" },
    { key: "owner", header: "Owner", width: "w-32" },
    { key: "status", header: "Listing Status", width: "w-24" },
    { key: "createdAt", header: "Submitted At", width: "w-32" },
    { key: "updatedAt", header: "Last Updated At", width: "w-32" },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.width}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, idx) => (
          <TableRow key={idx}>
            {columns.map((col) => (
              <TableCell key={col.key} className={col.width}>
                {col.key === "status" ? (
                  <Skeleton className={`h-6 rounded-full ${col.width}`} />
                ) : (
                  <Skeleton className={`h-4 ${col.width}`} />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
