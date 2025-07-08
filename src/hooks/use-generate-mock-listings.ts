import { useMutation } from "@tanstack/react-query";
import { generateMockListings } from "@/lib/queries";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/utils";
import { toast } from "sonner";

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
