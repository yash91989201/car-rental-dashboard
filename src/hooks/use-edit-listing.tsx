import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
import { queryClient } from "@/lib/query-client";
// QUERIES
import { editListing } from "@/lib/queries";
// TYPES
import type { EditListingInputType, EditListingQueryType } from "@/lib/types";

export const useEditListing = () => {
  return useMutation({
    mutationFn: async ({
      query,
      input,
    }: {
      query: EditListingQueryType;
      input: EditListingInputType;
    }) => editListing(query, input),
    onSuccess: () => {
      toast.success("Listing updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update listing: ${error.message}`);
    },
    onSettled: async (_, __, variables) => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.getListing({ id: variables.query.id }),
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.getListingLog({ id: variables.query.id }),
      });
    },
  });
};
