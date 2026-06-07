import { Fragment } from "react";
import { Placeholder } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CopyButton } from "../common/copy-button";
import { TooltipButtonLink } from "../common/tooltip-button-link";
import { userQueryOptions } from "../../options/users/user-query-options";
import { ConfirmationModalButton } from "../common/confirmation-modal-button";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { specificationQueryOptions } from "../../options/specifications/specification-query-options";
import {
  ArchiveFill,
  CheckSquareFill,
  InfoCircle,
  Trash3Fill,
} from "react-bootstrap-icons";
import {
  deleteSpecificationMutationOptions,
  updateSpecificationMutationOptions,
} from "../../options/specifications/specification-mutation-options";

export interface SpecificationTableEntryProps {
  readonly name: string;
}

export function SpecificationTableEntry({
  name,
}: SpecificationTableEntryProps) {
  const { t } = useTranslation();
  const {
    data: { username: owner },
  } = useSuspenseQuery(userQueryOptions);
  const { data, isLoading } = useQuery(
    specificationQueryOptions({ owner, name }),
  );
  const deleteMutation = useMutation(deleteSpecificationMutationOptions);
  const updateMutation = useMutation(updateSpecificationMutationOptions);

  if (isLoading) {
    return (
      <tr>
        <Placeholder animation="glow" as="td">
          <Placeholder size="lg" xs={12} />
        </Placeholder>
        <Placeholder animation="glow" as="td">
          <Placeholder size="lg" xs={12} />
        </Placeholder>
        <Placeholder animation="glow" as="td">
          <Placeholder size="lg" xs={12} />
        </Placeholder>
      </tr>
    );
  }

  const action = data?.status === "archived" ? "activate" : "archive";
  return (
    <tr>
      <td>
        <div className="d-flex">
          <CopyButton size="sm">{data?.specification?.name}</CopyButton>
        </div>
      </td>
      <td>
        <div className="d-flex">{data?.status}</div>
      </td>
      <td className="d-flex gap-2">
        {data?.specification?.name !== undefined && (
          <Fragment>
            <TooltipButtonLink
              params={{ name }}
              size="sm"
              to="/specifications/$name"
              tooltip={t("specification.view")}
              variant="outline-info"
            >
              <InfoCircle />
            </TooltipButtonLink>
            <ConfirmationModalButton
              message={t("specification.actionConfirm", {
                action: t(`specification.${action}`),
                name,
              })}
              mutation={updateMutation}
              size="sm"
              title={t("specification.actionTitle", {
                action: t(`specification.${action}`),
              })}
              tooltip={t("specification.actionTooltip", {
                action: t(`specification.${action}`),
              })}
              variables={{ action, name } as const}
              variant="outline-warning"
            >
              {action === "archive" ? <ArchiveFill /> : <CheckSquareFill />}
            </ConfirmationModalButton>
            <ConfirmationModalButton
              message={t("specification.deleteConfirm", { name })}
              mutation={deleteMutation}
              size="sm"
              title={t("specification.deleteTitle")}
              tooltip={t("specification.deleteTooltip")}
              variables={name}
              variant="outline-danger"
            >
              <Trash3Fill />
            </ConfirmationModalButton>
          </Fragment>
        )}
      </td>
    </tr>
  );
}
