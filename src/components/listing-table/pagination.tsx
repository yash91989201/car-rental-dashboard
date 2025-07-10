// UI
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// ICONS
import { ChevronDown } from "lucide-react";

type TablePaginationProps = {
  page: number;
  limit: number;
  totalPages: number;
  changeLimit: (limit: number) => void;
  changePage: (page: number) => void;
};

export const TablePagination = ({
  page,
  limit,
  totalPages,
  changePage,
  changeLimit,
}: TablePaginationProps) => {
  return (
    <div className="my-12 flex flex-col items-end gap-3">
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={() => changePage(page - 1)}
            />
          </PaginationItem>
          {[...Array<number>(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => changePage(i + 1)}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              className={
                page === totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={() => changePage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Page Size: {limit} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[10, 20, 30, 40, 50].map((size) => (
              <DropdownMenuItem key={size} onClick={() => changeLimit(size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
