import { fetchQuery } from "../utils/query";
import { Specification } from "../pages/specifications/specification";
import { userQueryOptions } from "../options/users/user-query-options";
import { SpecificationPendingPanel } from "../pages/specifications/specification-pending-panel";
import { specificationQueryOptions } from "../options/specifications/specification-query-options";

export const Route = createFileRoute({
  component: Specification,
  loader: async ({ context: { queryClient }, params: { name } }) => {
    const { username: owner } =
      await queryClient.ensureQueryData(userQueryOptions);
    return await fetchQuery(
      queryClient,
      specificationQueryOptions({ name, owner }),
    );
  },
  pendingComponent: SpecificationPendingPanel,
});
