import type { QueryClient } from "@tanstack/react-query";

import { App } from "../app";
import { fetchQuery } from "../utils/query";
import { ErrorRootPanel } from "../pages/common/error-root-panel";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { PendingUserPanel } from "../pages/common/pending-user-panel";
import { userQueryOptions } from "../options/users/user-query-options";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: App,
  errorComponent: ErrorRootPanel,
  loader: async ({ context: { queryClient } }) =>
    await fetchQuery(queryClient, userQueryOptions),
  pendingComponent: PendingUserPanel,
  wrapInSuspense: true,
});
