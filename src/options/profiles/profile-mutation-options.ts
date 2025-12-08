import { mutationOptions } from "@tanstack/react-query";
import { profileKey, PROFILES_KEY } from "./profile-keys";
import { mutationErrorOptions } from "../common/mutation-error-options";
import {
  deleteProfile,
  deleteProfiles,
  saveProfile,
  updateProfile,
} from "../../services/profiles/profile-service";

export const deleteProfileMutationOptions = mutationOptions({
  mutationFn: async (name?: string) =>
    name !== undefined ? await deleteProfile(name) : await deleteProfiles(),
  onSuccess: async (_0, _1, _2, { client }) =>
    await client.invalidateQueries({
      exact: false,
      queryKey: PROFILES_KEY,
    }),
  ...mutationErrorOptions({
    title: (_, name) =>
      name !== undefined
        ? `Error while deleting profile ${name}`
        : "Error while deleting profiles",
  }),
});

export const saveProfileMutationOptions = mutationOptions({
  mutationFn: saveProfile,
  onSuccess: async (_0, _1, _2, { client }) =>
    await client.invalidateQueries({
      exact: false,
      queryKey: PROFILES_KEY,
    }),
  ...mutationErrorOptions({
    skipErrorCheck: false,
    title: "Error while saving profile",
  }),
});

export const updateProfileMutationOptions = mutationOptions({
  mutationFn: async ({
    name,
    ...request
  }: {
    readonly name: Parameters<typeof updateProfile>[0];
  } & Parameters<typeof updateProfile>[1]) =>
    await updateProfile(name, request),
  onSuccess: async ({ name, owner }, _1, _2, { client }) =>
    await client.invalidateQueries({
      exact: false,
      queryKey: profileKey({ name, owner }),
    }),
  ...mutationErrorOptions({
    title: "Error while updating profile",
  }),
});
