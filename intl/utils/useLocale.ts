import { useLocales } from "expo-localization";

import { AppPreferences } from "~/modules/settings/constants";
import { useAppPreference, useSaveAppPreference } from "~/modules/settings/hooks";

import { Language } from "./constants";
import { useCallback } from "react";

export function useLocale() {
  const [locale] = useLocales();
  const { appPreference: languagePreference, error: errorLoadPreference, loading: loadingLoadPreference } = useAppPreference(AppPreferences.LANGUAGE);
  const { saveAppPreference, error: errorSavePreference, loading: loadingSavePreference } = useSaveAppPreference();

  const changeLanguage = useCallback((newLanguage: string) => {
    saveAppPreference({
      id: AppPreferences.LANGUAGE,
      value: newLanguage
    });
  }, [saveAppPreference]);
  
  const selectedLanguage = (languagePreference?.value ?? locale.languageCode) as Language;
  const error = errorLoadPreference || errorSavePreference;
  const loading = loadingLoadPreference || loadingSavePreference;

  return {
    selectedLanguage,
    changeLanguage,
    error,
    loading,
  };
}