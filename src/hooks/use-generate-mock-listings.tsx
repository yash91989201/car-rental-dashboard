import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
// UTILS
import { queryKeys } from "@/lib/utils";
import { queryClient } from "@/lib/query-client";
// QUERIES
import { generateMockListings } from "@/lib/queries";

export const useGenerateMockListings = () =>
  useMutation({
    mutationFn: generateMockListings,
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.all() });
    },
  });
