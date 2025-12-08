import type { ScraperUnownedProfile } from "../../models/profiles/scraper-unowned-profile";

import { Fragment, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dropdown, Form } from "react-bootstrap";
import { FieldControlled } from "../common/field-controlled";
import { PendingIndicator } from "../common/pending-indicator";
import { Controller, useWatch, type Control } from "react-hook-form";
import { sharedSpecificationsQueryOptions } from "../../options/specifications/shared-specification-query-options";

export interface ProfileSpecificationFieldControlledProps {
  readonly control: Control<ScraperUnownedProfile, unknown>;
  readonly query: string;
  readonly queryControl: Control<{ query: string }>;
  readonly readOnly?: boolean;
}

export function ProfileSpecificationFieldControlled({
  control,
  query,
  queryControl,
  readOnly,
}: ProfileSpecificationFieldControlledProps) {
  const { data, isLoading } = useQuery({
    ...sharedSpecificationsQueryOptions(query),
    enabled: readOnly !== true,
  });

  const { name, owner } = useWatch({
    control,
    name: "specification",
    disabled: data !== undefined,
  });

  const options = useMemo(
    () =>
      isLoading
        ? []
        : (data?.map(({ name, owner }) => ({
            key: `${owner}-${name}`,
            label: `${owner}-${name}`,
            value: { name, owner },
          })) ?? []),
    [data, isLoading],
  );

  return (
    <FieldControlled
      compareFn={(
        { name: optionName, owner: optionOwner },
        { name: selectedName, owner: selectedOwner },
      ) => optionName === selectedName && optionOwner === selectedOwner}
      control={control}
      defaultValue={name.trim().length > 0 ? `${owner}-${name}` : undefined}
      disabled={readOnly === true ? true : undefined}
      label="Profile's specification"
      name="specification"
      options={options}
      placeholder="Select specification"
      readOnly={readOnly}
      type="select"
      variant="outline-secondary"
    >
      {readOnly !== true && (
        <Controller
          control={queryControl}
          name="query"
          render={({ field }) => {
            const element = (
              <Dropdown.Item
                {...field}
                as={Form.Control}
                onClick={(event) => event.stopPropagation()}
                placeholder="Search specifications"
              />
            );

            return isLoading ? (
              <Fragment>
                {element}
                <Dropdown.Item className="p-1">
                  <PendingIndicator />
                </Dropdown.Item>
              </Fragment>
            ) : (
              element
            );
          }}
        />
      )}
    </FieldControlled>
  );
}
