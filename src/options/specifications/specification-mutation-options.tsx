import { Translation } from "react-i18next";
import { mutationOptions } from "@tanstack/react-query";
import { mutationErrorOptions } from "../common/mutation-error-options";
import { specificationKey, SPECIFICATIONS_KEY } from "./specification-keys";
import {
  deleteSpecification,
  deleteSpecifications,
  updateSpecification,
  uploadSpecification,
} from "../../services/specifications/specification-service";

export const deleteSpecificationMutationOptions = mutationOptions({
  mutationFn: async (name?: string) =>
    name !== undefined
      ? await deleteSpecification(name)
      : await deleteSpecifications(),
  onSuccess: async (_0, _1, _2, { client }) =>
    await client.invalidateQueries({
      exact: false,
      queryKey: SPECIFICATIONS_KEY,
    }),
  ...mutationErrorOptions({
    title: (_, name) =>
      name !== undefined ? (
        <Translation>
          {(t) => t("errors.specification.delete", { name })}
        </Translation>
      ) : (
        <Translation>
          {(t) => t("errors.specification.deleteBatch")}
        </Translation>
      ),
  }),
});

export const updateSpecificationMutationOptions = mutationOptions({
  mutationFn: async ({
    name,
    action,
  }: {
    readonly action: Parameters<typeof updateSpecification>[1];
    readonly name: Parameters<typeof updateSpecification>[0];
  }) => await updateSpecification(name, action),
  onSuccess: async ({ owner }, { name }, _2, { client }) =>
    await client.invalidateQueries({
      exact: false,
      queryKey: specificationKey({ name, owner }),
    }),
  ...mutationErrorOptions({
    title: (_0, { action }) => (
      <Translation>{(t) => t(`errors.specification.${action}`)}</Translation>
    ),
  }),
});

export const uploadSpecificationMutationOptions = mutationOptions({
  mutationFn: async (specification?: File) =>
    await uploadSpecification(specification),
  onSuccess: async (_0, _1, _2, { client }) =>
    await client.invalidateQueries({
      exact: false,
      queryKey: SPECIFICATIONS_KEY,
    }),
  ...mutationErrorOptions({
    skipErrorCheck: false,
    title: <Translation>{(t) => t("errors.specification.upload")}</Translation>,
  }),
});
