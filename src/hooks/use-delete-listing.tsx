import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
import { getQueryClient } from "@/lib/query-client";
// QUERIES
import { deleteListing } from "@/lib/queries";
// CUSTOM HOOKS
import { useGetListingsQuery } from "./use-get-listings-query";
import type { GetListingsOutputType } from "@/lib/types";

export const useDeleteListing = () => {
  const queryClient = getQueryClient();
  const listingsQuery = useGetListingsQuery();

  return useMutation({
    mutationFn: deleteListing,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.getListings(listingsQuery),
      });

      const previousListingData =
        queryClient.getQueryData<GetListingsOutputType>(
          queryKeys.getListings(listingsQuery),
        );

      queryClient.setQueryData<GetListingsOutputType>(
        queryKeys.getListings(listingsQuery),
        (old) => {
          if (!old) return old;

          const filteredListings =
            old.data?.listings.filter((listing) => listing.id !== id) ?? [];

          const updatedListingData = {
            ...old,
            data: {
              listings: filteredListings,
            },
          };

          return updatedListingData;
        },
      );
      return { previousListingData };
    },
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error, _, context) => {
      if (context?.previousListingData) {
        queryClient.setQueryData(
          queryKeys.getListings(listingsQuery),
          context.previousListingData,
        );
      }
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
