import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
import { getQueryClient } from "@/lib/query-client";
// QUERIES
import { editListing } from "@/lib/queries";
// TYPES
import type {
  EditListingInputType,
  EditListingQueryType,
  GetListingsOutputType,
  GetListingOutputType,
} from "@/lib/types";
// CUSTOM HOOKS
import { useGetListingsQuery } from "./use-get-listings-query";

export const useEditListing = () => {
  const queryClient = getQueryClient();
  const listingsQuery = useGetListingsQuery();

  const getListingsQueryKey = queryKeys.getListings(listingsQuery);

  return useMutation({
    mutationFn: async ({
      query,
      input,
    }: {
      query: EditListingQueryType;
      input: EditListingInputType;
    }) => editListing(query, input),
    onMutate: async ({ query, input }) => {
      await queryClient.cancelQueries({
        queryKey: getListingsQueryKey,
      });

      await queryClient.cancelQueries({
        queryKey: queryKeys.getListing({ id: query.id }),
      });

      const previousListingsData =
        queryClient.getQueryData<GetListingsOutputType>(getListingsQueryKey);

      const previousListingData =
        queryClient.getQueryData<GetListingOutputType>(
          queryKeys.getListing({ id: query.id }),
        );

      queryClient.setQueryData<GetListingsOutputType>(
        getListingsQueryKey,
        (old) => {
          if (!old) return old;
          const updatedListings = old.data?.listings.map((listing) => {
            if (listing.id === query.id) {
              return {
                ...listing,
                ...input,
              };
            }
            return listing;
          });
          return {
            ...old,
            data: {
              listings: updatedListings ?? [],
            },
          };
        },
      );

      queryClient.setQueryData<GetListingOutputType>(
        queryKeys.getListing({ id: query.id }),
        (old) => {
          if (!old?.data?.listing) return old;
          return {
            ...old,
            data: {
              listing: {
                ...old.data.listing,
                ...input,
              },
            },
          };
        },
      );

      return { previousListingsData, previousListingData };
    },

    onSuccess: () => {
      toast.success("Listing updated successfully");
    },

    onError: (error, _, context) => {
      if (context?.previousListingsData) {
        queryClient.setQueryData(
          queryKeys.getListings(listingsQuery),
          context.previousListingsData,
        );
      }

      if (context?.previousListingData) {
        const id = context.previousListingData.data?.listing?.id ?? "";
        queryClient.setQueryData(
          queryKeys.getListing({ id }),
          context.previousListingData,
        );
      }

      toast.error(`Failed to update listing: ${error.message}`);
    },

    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getListingsQueryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListing({ id: variables.query.id }),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.getListingLog({ id: variables.query.id }),
      });
    },
  });
};
