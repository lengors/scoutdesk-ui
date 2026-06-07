import { useTranslation } from "react-i18next";
import { PendingPanel } from "../common/pending-panel";
import { Route } from "../../routes/specifications.$name";

export function SpecificationPendingPanel() {
  const { t } = useTranslation();
  const { name } = Route.useParams();
  return (
    <PendingPanel>
      {t("specification.loading_one", { count: 1, name })}
    </PendingPanel>
  );
}
