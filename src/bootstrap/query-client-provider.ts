import { QueryClient } from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      readonly queryClient: QueryClient;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      meta: {
        get queryClient(): QueryClient {
          return queryClient;
        },
      },
    },
  },
});
