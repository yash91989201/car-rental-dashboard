import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
import { queryClient } from "@/lib/query-client";
// QUERIES
import { deleteListing } from "@/lib/queries";
// CUSTOM HOOKS
import { useGetListingsQuery } from "./use-get-listings-query";

export const useDeleteListing = () => {
  const listingsQuery = useGetListingsQuery();

  return useMutation({
    mutationFn: deleteListing,
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListings(listingsQuery),
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.getListingLog({ id: variables.id }),
      });
    },
  });
};
