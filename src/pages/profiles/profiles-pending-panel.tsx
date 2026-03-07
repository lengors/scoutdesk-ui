import { useTranslation } from "react-i18next";
import { PendingPanel } from "../common/pending-panel";

export function ProfilesPendingPanel() {
  const { t } = useTranslation();
  return <PendingPanel>{t("profile.loading")}</PendingPanel>;
}
