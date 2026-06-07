import type { NotificationStack } from "../services/notifications/notification-stack";

import { QueryClient } from "@tanstack/react-query";
import { notificationStack } from "./notification-stack-provider";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      readonly notificationStack: NotificationStack;
      readonly queryClient: QueryClient;
    };

    mutationMeta: {
      readonly notificationStack: NotificationStack;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      meta: {
        notificationStack,
        get queryClient(): QueryClient {
          return queryClient;
        },
      },
    },
    mutations: {
      meta: {
        notificationStack,
      },
    },
  },
});
