import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
// QUERIES
import { updateListingStatus } from "@/lib/queries";
// TYPES
import type {
  UpdateListingStatusInputType,
  UpdateListingStatusQueryType,
} from "@/lib/types";
// CUSTOM HOOKS
import { useGetListingsQuery } from "@/hooks/use-get-listings-query";
import { getQueryClient } from "@/lib/query-client";

export function useUpdateListingStatus() {
  const queryClient = getQueryClient();
  const listingsQuery = useGetListingsQuery();

  return useMutation({
    mutationFn: ({
      query,
      input,
    }: {
      query: UpdateListingStatusQueryType;
      input: UpdateListingStatusInputType;
    }) => updateListingStatus(query, input),
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListings(listingsQuery),
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.getListing({ id: variables.query.id }),
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.getListingLog({ id: variables.query.id }),
      });
    },
  });
}
