import { PendingPanel } from "../common/pending-panel";
import { Route } from "../../routes/specifications.$name";

export function SpecificationPendingPanel() {
  const { name } = Route.useParams();
  return <PendingPanel>{`Loading "${name}" specification...`}</PendingPanel>;
}
