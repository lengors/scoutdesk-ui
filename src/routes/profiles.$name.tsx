import { z } from "zod/mini";
import { fetchQuery } from "../utils/query";
import { Profile } from "../pages/profiles/profile";
import { userQueryOptions } from "../options/users/user-query-options";
import { ProfilePendingPanel } from "../pages/profiles/profile-pending-panel";
import { profileQueryOptions } from "../options/profiles/profile-query-options";

export const Route = createFileRoute({
  component: Profile,
  loader: async ({ context: { queryClient }, params: { name } }) => {
    const { username: owner } =
      await queryClient.ensureQueryData(userQueryOptions);
    return await fetchQuery(queryClient, profileQueryOptions({ name, owner }));
  },
  pendingComponent: ProfilePendingPanel,
  validateSearch: z.readonly(
    z.object({
      readOnly: z._default(z.boolean(), true),
    }),
  ),
});
