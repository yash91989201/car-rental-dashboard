import { QueryClient } from "@tanstack/react-query";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const config = {
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
};

const createQueryClient = () => new QueryClient(config);

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  return (clientQueryClientSingleton ??= createQueryClient());
};
