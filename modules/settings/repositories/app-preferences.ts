import { dbWaitForReady } from "~/db";
import { Maybe } from "~/modules/shared/types";

import { AppPreference, AppPreferenceInput } from "../types";
import { AppPreferences } from "../constants";

export async function getAppPreferenceById(appPreferenceId: AppPreferences): Promise<Maybe<AppPreference>> {
  await dbWaitForReady();
  return AppPreference.findOneByOrFail({ id: appPreferenceId });
}

export async function saveAppPreference(input: AppPreferenceInput): Promise<void> {
  await dbWaitForReady();
  const appPreference = await AppPreference.findOneByOrFail({ id: input.id });
  appPreference.value = input.value;
  await appPreference.save();
}