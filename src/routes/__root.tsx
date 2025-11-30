import type { QueryClient } from "@tanstack/react-query";

import { App } from "../app";
import { Fragment } from "react";
import { fetchQuery } from "../utils/query";
import { ErrorPanel } from "../pages/common/error-panel";
import { PendingPanel } from "../pages/common/pending-panel";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { userQueryOptions } from "../options/users/user-query-options";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: App,
  errorComponent: ({ error }) => (
    <Fragment>
      <ErrorPanel error={error} />
      <TanStackRouterDevtools />
    </Fragment>
  ),
  loader: async ({ context: { queryClient } }) =>
    await fetchQuery(queryClient, userQueryOptions),
  pendingComponent: () => (
    <Fragment>
      <PendingPanel>{`Loading user data...`}</PendingPanel>
      <TanStackRouterDevtools />
    </Fragment>
  ),
  wrapInSuspense: true,
});
