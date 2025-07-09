import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateListingStatus } from "@/lib/queries";
import type {
  UpdateListingStatusInputType,
  UpdateListingStatusQueryType,
} from "@/lib/types";
import { toast } from "sonner";
import { queryKeys } from "@/lib/utils";
import { useGetListingsQuery } from "@/hooks/use-get-listings-query";

export function useUpdateListingStatus() {
  const queryClient = useQueryClient();
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
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListings(listingsQuery),
      });
    },
  });
}
