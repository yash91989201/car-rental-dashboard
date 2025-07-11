import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
import { getQueryClient } from "@/lib/query-client";
// QUERIES
import { updateListingStatus } from "@/lib/queries";
// TYPES
import type {
  GetListingsOutputType,
  UpdateListingStatusInputType,
  UpdateListingStatusQueryType,
} from "@/lib/types";
// CUSTOM HOOKS
import { useGetListingsQuery } from "@/hooks/use-get-listings-query";

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
    onMutate: async ({ query, input }) => {
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

          const updatedListings = old.data?.listings.map((listing) => {
            if (listing.id === query.id) {
              return {
                ...listing,
                status: input.status,
              };
            }

            return listing;
          });

          const updatedListingData = {
            ...old,
            data: {
              listings: updatedListings ?? [],
            },
          };

          return updatedListingData;
        },
      );
      return { previousListingData };
    },

    onSuccess: ({ message }) => {
      toast.success(message);
    },

    onError: (err, _, context) => {
      if (context?.previousListingData) {
        queryClient.setQueryData(
          queryKeys.getListings(listingsQuery),
          context.previousListingData,
        );
      }

      toast.error(
        typeof err === "object" && "message"
          ? err.message
          : "Failed to update listing status",
      );
    },

    onSettled: async (_, __, variables) => {
      await queryClient.refetchQueries({
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
