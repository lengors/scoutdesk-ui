import { useTranslation } from "react-i18next";
import { Route } from "../../routes/profiles.$name";
import { PendingPanel } from "../common/pending-panel";

export function ProfilePendingPanel() {
  const { t } = useTranslation();
  const { name } = Route.useParams();
  return (
    <PendingPanel>{t("profile.loading", { count: 1, name })}</PendingPanel>
  );
}
