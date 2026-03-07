import { fetchQuery } from "../utils/query";
import { Profiles } from "../pages/profiles/profiles";
import { ProfilesPendingPanel } from "../pages/profiles/profiles-pending-panel";
import { profilesQueryOptions } from "../options/profiles/profile-query-options";

export const Route = createFileRoute({
  component: Profiles,

  // NOTE: Return type void and explicit return to avoid inference issues with the query data type
  loader: async ({ context: { queryClient } }): Promise<void> => {
    return await fetchQuery(queryClient, profilesQueryOptions);
  },
  pendingComponent: ProfilesPendingPanel,
});
