import { Route } from "../../routes/profiles.$name";
import { PendingPanel } from "../common/pending-panel";

export function ProfilePendingPanel() {
  const { name } = Route.useParams();
  return <PendingPanel>{`Loading "${name}" profile...`}</PendingPanel>;
}
