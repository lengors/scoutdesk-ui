import { fetchQuery } from "../utils/query";
import { PendingPanel } from "../pages/common/pending-panel";
import { Specifications } from "../pages/specifications/specifications";
import { specificationsQueryOptions } from "../options/specifications/specification-query-options";

export const Route = createFileRoute({
  component: Specifications,

  // NOTE: Return type void and explicit return to avoid inference issues with the query data type
  loader: async ({ context: { queryClient } }): Promise<void> => {
    return await fetchQuery(queryClient, specificationsQueryOptions);
  },
  pendingComponent: () => (
    <PendingPanel>Loading specifications...</PendingPanel>
  ),
});
