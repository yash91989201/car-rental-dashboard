import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateListingStatus } from "@/lib/queries";
import type {
  UpdateListingStatusInputType,
  UpdateListingStatusQueryType,
} from "@/lib/types";
import { toast } from "sonner";
import { queryKeys } from "@/lib/utils";

export function useUpdateListingStatus() {
  const queryClient = useQueryClient();

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
        queryKey: queryKeys.getListings({}),
      });
    },
  });
}
