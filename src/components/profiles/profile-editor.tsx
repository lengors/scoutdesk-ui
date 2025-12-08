import type { ScraperSpecificationRequirement } from "@lengors/protoscout-schemas/scrapers/specifications";

import { useWatch } from "react-hook-form";
import { useForm } from "../../hooks/use-form";
import { Col, Form, Row } from "react-bootstrap";
import { Fragment, useEffect, useMemo } from "react";
import { useDebounce } from "../../hooks/use-debounce";
import { SubmitButton } from "../common/submit-button";
import { FieldControlled } from "../common/field-controlled";
import { PendingIndicator } from "../common/pending-indicator";
import { userQueryOptions } from "../../options/users/user-query-options";
import { ScraperUnownedProfile } from "../../models/profiles/scraper-unowned-profile";
import { ProfileSpecificationFieldControlled } from "./profile-specification-field-controlled";
import { sharedSpecificationQueryOptions } from "../../options/specifications/shared-specification-query-options";
import {
  profileKey,
  profileRequirementBatchKey,
} from "../../options/profiles/profile-keys";
import {
  profileQueryOptions,
  profileRequirementBatchQueryOptions,
} from "../../options/profiles/profile-query-options";
import {
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  saveProfileMutationOptions,
  updateProfileMutationOptions,
} from "../../options/profiles/profile-mutation-options";

export type ProfileEditorProps =
  | {
      readonly name: string;
      readonly readOnly: boolean;
    }
  | {
      readonly name?: never;
      readonly readOnly?: never;
    };

export function ProfileEditor({ name, readOnly }: ProfileEditorProps) {
  const {
    data: { username: owner },
  } = useSuspenseQuery(userQueryOptions);
  const { data } = useSuspenseQuery({
    ...(name !== undefined
      ? profileQueryOptions({ name, owner })
      : queryOptions({
          queryKey: profileKey({ name: "", owner }),
          queryFn: () => ({
            name: "",
            specification: { owner, name: "" },
            inputs: {},
            owner,
          }),
        })),
    select: ({ owner: _, ...unownedProfile }) => unownedProfile,
  });
  const { data: profileRequirements } = useQuery(
    name !== undefined
      ? profileRequirementBatchQueryOptions({ owner, name })
      : queryOptions({
          queryKey: profileRequirementBatchKey({ name: "", owner }),
          queryFn: () => [] as ReadonlyArray<ScraperSpecificationRequirement>,
        }),
  );

  const { control, formState, getFieldState, handleSubmit, reset, setValue } =
    useForm<ScraperUnownedProfile>({
      defaultValues: data,
    });
  const { control: queryControl } = useForm<{ readonly query: string }>({
    defaultValues: { query: "" },
  });
  const query = useWatch({ control: queryControl, name: "query" });
  const debouncedQuery = useDebounce(query, 750);
  const ownedSpecificationReference = useWatch({
    control,
    name: "specification",
  });
  const inputs = useWatch({
    control,
    name: "inputs",
  });
  const { isTouched } = getFieldState("specification", formState);
  const { isSubmitting } = formState;

  const { data: ownedSpecification, isLoading } = useQuery({
    ...sharedSpecificationQueryOptions(ownedSpecificationReference),
    enabled: isTouched && ownedSpecificationReference.name !== "",
  });

  const requirements: ReadonlyArray<ScraperSpecificationRequirement> = useMemo(
    () =>
      ownedSpecification?.specification?.settings?.requirements ??
      profileRequirements ??
      [],
    [ownedSpecification, profileRequirements],
  );

  const { mutateAsync } = useMutation(
    name !== undefined
      ? updateProfileMutationOptions
      : saveProfileMutationOptions,
  );

  useEffect(() => reset(data), [data, reset]);
  useEffect(() => {
    if (isTouched) {
      ownedSpecification?.specification?.settings?.requirements?.forEach(
        ({ name, default: defaultValue }) =>
          setValue(`inputs.${name}`, defaultValue ?? ""),
      );
    }
  }, [isTouched, ownedSpecification, setValue]);

  return (
    <Form noValidate onSubmit={handleSubmit(async (data) => mutateAsync(data))}>
      <Row className="g-3">
        <Col xs={12}>
          <Row className="g-3">
            <Col lg={name === undefined ? 12 : undefined} md={6} xs={12}>
              <FieldControlled
                control={control}
                disabled={readOnly || name !== undefined}
                label="Profile's name"
                name="name"
                placeholder="Enter profile name"
                readOnly={readOnly || name !== undefined}
                type="text"
              />
            </Col>
            <Col lg={name === undefined ? 12 : undefined} md={6} xs={12}>
              <ProfileSpecificationFieldControlled
                control={control}
                query={debouncedQuery}
                queryControl={queryControl}
                readOnly={readOnly}
              />
            </Col>
            {isLoading ? (
              <Col xs={12}>
                <PendingIndicator>Loading requirements...</PendingIndicator>
              </Col>
            ) : (
              requirements
                .filter(
                  ({ name: requirementName }) => requirementName in inputs,
                )
                .map(({ name: requirementName, type }) => (
                  <Col
                    key={requirementName}
                    lg={name === undefined ? 12 : undefined}
                    md={6}
                    xs={12}
                  >
                    <FieldControlled
                      control={control}
                      disabled={readOnly}
                      label={`Profile's "${requirementName}" input`}
                      name={`inputs.${requirementName}`}
                      placeholder={`Enter "${requirementName}"`}
                      readOnly={readOnly}
                      type={type}
                    />
                  </Col>
                ))
            )}
          </Row>
          {readOnly !== true && (
            <Fragment>
              <hr className="my-3" />
              <Row className="g-3 justify-content-end">
                <Col
                  lg={name === undefined ? 12 : undefined}
                  md={name === undefined ? 6 : "auto"}
                  xs={12}
                >
                  <SubmitButton className="w-100" disabled={isSubmitting}>
                    Save profile
                  </SubmitButton>
                </Col>
              </Row>
            </Fragment>
          )}
        </Col>
      </Row>
    </Form>
  );
}
