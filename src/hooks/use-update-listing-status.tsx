import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
import { getQueryClient } from "@/lib/query-client";
// QUERIES
import { updateListingStatus } from "@/lib/queries";
// TYPES
import type {
  GetListingOutputType,
  GetListingQueryType,
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

      const previousListingsData =
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

      const previousListingData = queryClient.getQueryData<GetListingQueryType>(
        queryKeys.getListing({ id: query.id }),
      );

      queryClient.setQueryData<GetListingOutputType>(
        queryKeys.getListing({ id: query.id }),
        (old) => {
          if (!old?.data?.listing) return old;

          const updatedListingData = {
            ...old,
            data: {
              listing: {
                ...old.data.listing,
                status: input.status,
              },
            },
          };

          return updatedListingData;
        },
      );

      return { previousListingData, previousListingsData };
    },

    onSuccess: ({ message }) => {
      toast.success(message);
    },

    onError: (err, _, context) => {
      if (context?.previousListingsData) {
        queryClient.setQueryData(
          queryKeys.getListings(listingsQuery),
          context.previousListingsData,
        );
      }

      if (context?.previousListingData) {
        queryClient.setQueryData(
          queryKeys.getListing({ id: context.previousListingData.id }),
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
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListings(listingsQuery),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListing({ id: variables.query.id }),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListingLog({ id: variables.query.id }),
      });
    },
  });
}
