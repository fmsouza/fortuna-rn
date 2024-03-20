import { useCallback, useState } from "react";
import { useRouter } from "expo-router";

import { AppPreferences } from "~/modules/settings/constants";
import { useAppPreference, useClearAllData, useSaveAppPreference } from "~/modules/settings/hooks";

export function useSettingsScreenState() {
  const router = useRouter();
  const { appPreference: darkModePreference } = useAppPreference(AppPreferences.DARK_MODE);
  const { saveAppPreference, error, loading } = useSaveAppPreference();
  const [showResetAllDataDialog, setShowResetAllDataDialog] = useState(false);
  const clearAllData = useClearAllData();

  const isDarkModeEnabled = Boolean(darkModePreference?.value);

  const handleDarkModeChange = useCallback(() => {
    saveAppPreference({
      id: AppPreferences.DARK_MODE,
      value: isDarkModeEnabled ? null : "true"
    });
  }, [isDarkModeEnabled, saveAppPreference]);

  const handleResetAllData = useCallback(async () => {
    await clearAllData();
    router.replace("/");
  }
  , [saveAppPreference]);

  const handleShowResetAllDataDialog = useCallback(() => {
    setShowResetAllDataDialog(true);
  }
  , [setShowResetAllDataDialog]);

  const handleDismissResetAllDataDialog = useCallback(() => {
    setShowResetAllDataDialog(false);
  }
  , [setShowResetAllDataDialog]);

  return {
    error,
    loading,
    isDarkModeEnabled,
    handleDarkModeChange,
    handleResetAllData,
    showResetAllDataDialog,
    handleDismissResetAllDataDialog,
    handleShowResetAllDataDialog,
  };
}