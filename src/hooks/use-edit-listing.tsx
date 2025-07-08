import { editListing } from "@/lib/queries";
import { queryClient } from "@/lib/query-client";
import type { EditListingInputType, EditListingQueryType } from "@/lib/types";
import { queryKeys } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListings({}),
      });
    },
  });
};
