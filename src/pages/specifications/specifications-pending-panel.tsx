import { useTranslation } from "react-i18next";
import { PendingPanel } from "../common/pending-panel";

export function SpecificationsPendingPanel() {
  const { t } = useTranslation();
  return <PendingPanel>{t("specification.loading")}</PendingPanel>;
}
