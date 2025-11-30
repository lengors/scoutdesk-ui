import { mutationOptions } from "@tanstack/react-query";
import { HttpError } from "../../models/http/http-error";
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
      queryKey: SPECIFICATIONS_KEY,
      exact: false,
    }),
  ...mutationErrorOptions({ title: "Error while deleting specification" }),
});

export const updateSpecificationMutationOptions = (owner: string) =>
  mutationOptions({
    mutationFn: async ({
      name,
      action,
    }: {
      readonly action: Parameters<typeof updateSpecification>[1];
      readonly name: Parameters<typeof updateSpecification>[0];
    }) => await updateSpecification(name, action),
    onSuccess: async (_0, { name }, _2, { client }) =>
      await client.invalidateQueries({
        queryKey: specificationKey({ name, owner }),
        exact: false,
      }),
    ...mutationErrorOptions({
      title: (_0, { action }) =>
        `Error while ${action === "activate" ? "activating" : "archiving"} specification`,
    }),
  });

export const uploadSpecificationMutationOptions = mutationOptions({
  mutationFn: uploadSpecification,
  onSuccess: async (_0, _1, _2, { client }) =>
    await client.invalidateQueries({
      queryKey: SPECIFICATIONS_KEY,
      exact: false,
    }),
  onError: (error, _1, _2, context) => {
    if (!(error instanceof HttpError)) {
      return;
    }

    const response = error?.response;
    if (
      typeof response === "string" ||
      "message" in response ||
      "error" in response
    ) {
      context?.meta?.notificationStack?.pushNotification?.({
        delay: 10000,
        level: "error",
        title: "Error while uploading specification",
        message: error.message,
      });
    }
  },
});
