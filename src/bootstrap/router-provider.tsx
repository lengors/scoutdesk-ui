import { routeTree } from "../routeTree.gen";
import { queryClient } from "./query-client-provider";
import { ErrorPanel } from "../pages/common/error-panel";
import { NotFoundPanel } from "../pages/common/not-found-panel";
import { PendingIndicator } from "../components/common/pending-indicator";
import {
  createRouter as createNativeRouter,
  type RouterHistory,
} from "@tanstack/react-router";

export function createRouter({
  history,
}: {
  readonly history?: RouterHistory;
}) {
  return createNativeRouter({
    context: { queryClient },
    defaultErrorComponent: ErrorPanel,
    defaultNotFoundComponent: (props) => <NotFoundPanel {...props} />,
    defaultPendingComponent: PendingIndicator,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    routeTree,
    history,
    scrollRestoration: true,
  });
}

export const router = createRouter({});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
