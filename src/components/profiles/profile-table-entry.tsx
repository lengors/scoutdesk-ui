import { Fragment } from "react";
import { Placeholder } from "react-bootstrap";
import { CopyButton } from "../common/copy-button";
import { TooltipButtonLink } from "../common/tooltip-button-link";
import { userQueryOptions } from "../../options/users/user-query-options";
import { InfoCircle, PencilSquare, Trash3Fill } from "react-bootstrap-icons";
import { ConfirmationModalButton } from "../common/confirmation-modal-button";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "../../options/profiles/profile-query-options";
import { deleteProfileMutationOptions } from "../../options/profiles/profile-mutation-options";

export interface ProfileTableEntryProps {
  readonly name: string;
}

export function ProfileTableEntry({ name }: ProfileTableEntryProps) {
  const {
    data: { username: owner },
  } = useSuspenseQuery(userQueryOptions);
  const { data, isLoading } = useQuery(profileQueryOptions({ owner, name }));
  const deleteMutation = useMutation(deleteProfileMutationOptions);

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

  return (
    <tr>
      <td>
        <div className="d-flex">
          <CopyButton size="sm">{data?.name}</CopyButton>
        </div>
      </td>
      <td>
        <div className="d-flex">
          <CopyButton size="sm">
            {data !== undefined
              ? `${data.specification.owner}-${data.specification.name}`
              : ""}
          </CopyButton>
        </div>
      </td>
      <td className="d-flex gap-2">
        {data?.name !== undefined && (
          <Fragment>
            <TooltipButtonLink
              params={{ name }}
              size="sm"
              to="/profiles/$name"
              tooltip="View profile"
              variant="outline-info"
            >
              <InfoCircle />
            </TooltipButtonLink>
            <TooltipButtonLink
              params={{ name: data.name }}
              to="/profiles/$name"
              tooltip="Edit profile"
              search={{ readOnly: false }}
              size="sm"
              variant="outline-warning"
            >
              <PencilSquare />
            </TooltipButtonLink>
            <ConfirmationModalButton
              message={`Are you sure you want to delete the profile "${name}"?`}
              mutation={deleteMutation}
              size="sm"
              title="Delete profile"
              tooltip="Delete this profile"
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
