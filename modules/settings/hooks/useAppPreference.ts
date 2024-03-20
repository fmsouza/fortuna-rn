import { useQuery } from '@tanstack/react-query';

import { Maybe } from "~/modules/shared/types";

import { AppPreference } from "../types";
import { getAppPreferenceById } from "../repositories";
import { AppPreferences } from '../constants';

export const useAppPreference = (appPreferenceId?: AppPreferences) => {
  const {data: appPreference, isPending, ...others} = useQuery<Maybe<AppPreference>>({
    queryKey: ["appPreference", appPreferenceId],
    queryFn: async () => appPreferenceId ? getAppPreferenceById(appPreferenceId) : null,
  });

  return {
    ...others,
    loading: isPending,
    appPreference,
  };
};
