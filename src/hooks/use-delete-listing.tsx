import { deleteListing } from "@/lib/queries";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListings(listingsQuery),
      });
    },
  });
};
