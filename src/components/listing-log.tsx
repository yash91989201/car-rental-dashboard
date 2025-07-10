import { useState } from "react";
import { useSession } from "next-auth/react";
// UTILS
import { getBadgeColor } from "@/lib/utils";
// CUSTOM HOOKS
import { useGetListingLog } from "@/hooks/use-get-listing-log";
// UI
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const ListingLog = ({ id }: { id: string }) => {
  const session = useSession();
  const { data, isPending } = useGetListingLog({ id });
  const [logFilter, setLogFilter] = useState<"all" | "self">("all");

  const userId = session.data?.user.id;
  const logs = data?.data?.logs ?? [];

  const filteredLogs =
    logFilter === "self" ? logs.filter((log) => log.adminId === userId) : logs;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex justify-end">
          <ToggleGroup
            type="single"
            value={logFilter}
            onValueChange={(val) => setLogFilter(val as "all" | "self")}
            variant="outline"
            size="sm"
            aria-label="Log Filter"
          >
            <ToggleGroupItem value="self">My Actions</ToggleGroupItem>
            <ToggleGroupItem value="all">All Actions</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {isPending ? (
          <p className="text-muted-foreground text-sm">Loading logs...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No actions yet.</p>
        ) : (
          <Table>
            <TableCaption>All admin actions on this listing</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge className={getBadgeColor(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.admin?.name ?? log.admin?.email ?? log.adminId}
                  </TableCell>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
