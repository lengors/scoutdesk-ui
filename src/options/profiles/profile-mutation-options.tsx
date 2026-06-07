import type { ScraperUnownedProfile } from "../../models/profiles/scraper-unowned-profile";

import { Translation } from "react-i18next";
import { mutationOptions } from "@tanstack/react-query";
import { SCRAPERS_KEY } from "../scrapers/scraper-keys";
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
  onSuccess: async (_0, _1, _2, { client }) => {
    await client.invalidateQueries({
      exact: false,
      queryKey: PROFILES_KEY,
    });
    await client.invalidateQueries({
      exact: false,
      queryKey: SCRAPERS_KEY,
    });
  },
  ...mutationErrorOptions({
    title: (_, name) => (
      <Translation>
        {(t) =>
          name !== undefined
            ? t("errors.profile.delete", { name })
            : t("errors.profile.deleteBatch")
        }
      </Translation>
    ),
  }),
});

export const saveProfileMutationOptions = mutationOptions({
  mutationFn: async (request: ScraperUnownedProfile) =>
    await saveProfile(request),
  onSuccess: async (_0, _1, _2, { client }) => {
    await client.invalidateQueries({
      exact: false,
      queryKey: PROFILES_KEY,
    });
    await client.invalidateQueries({
      exact: false,
      queryKey: SCRAPERS_KEY,
    });
  },
  ...mutationErrorOptions({
    skipErrorCheck: false,
    title: <Translation>{(t) => t("errors.profile.save")}</Translation>,
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
  onSuccess: async ({ name, owner }, _1, _2, { client }) => {
    await client.invalidateQueries({
      exact: false,
      queryKey: profileKey({ name, owner }),
    });
    await client.invalidateQueries({
      exact: false,
      queryKey: [...PROFILES_KEY, [name]],
    });
  },
  ...mutationErrorOptions({
    title: <Translation>{(t) => t("errors.profile.update")}</Translation>,
  }),
});
