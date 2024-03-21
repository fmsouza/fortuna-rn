import { useCallback, useState } from "react"

import { useText } from "~/intl";
import { Maybe } from "~/modules/shared/types";
import { useAppPreference, useSaveAppPreference } from "~/modules/settings/hooks";
import { AppPreferences } from "~/modules/settings/constants";

export enum Operation {
  BACKUP = "backup",
  RESTORE = "restore",
}

export enum Provider {
  LOCAL = "local",
  DROPBOX = "dropbox",
  GOOGLE_DRIVE = "googleDrive",
}

export type BackupProvider = {
  id: Provider;
  title: string;
  icon: string;
  lastBackupAt: Maybe<Date>;
};

export function useSettingsBackupRestoreScreenState() {
  const t = useText();
  const [activeOperation, setActiveOperation] = useState<Operation>(Operation.BACKUP);
  const [selectedProviderId, setSelectedProviderId] = useState<Maybe<Provider>>(null);
  const [showOperationConfirmationDialog, setShowOperationConfirmationDialog] = useState(false);
  const { appPreference: lastBackupLocalPreference } = useAppPreference(AppPreferences.LAST_BACKUP_LOCAL);
  const { saveAppPreference, error, loading } = useSaveAppPreference();

  const handleOperationChange = useCallback((operation: Operation) => {
    setActiveOperation(operation);
  }, [setActiveOperation]);

  const handleProviderPress = useCallback((providerId: Provider) => {
    setSelectedProviderId(providerId);
    setShowOperationConfirmationDialog(true);
  }, [setShowOperationConfirmationDialog]);

  const handleOperationDismiss = useCallback(() => {
    setSelectedProviderId(null);
    setShowOperationConfirmationDialog(false);
  }
  , [setSelectedProviderId, setShowOperationConfirmationDialog]);

  const handleOperationConfirm = useCallback(() => {
    setShowOperationConfirmationDialog(false);

    // TODO: Implement backup logic
    // activeOperation: Operation;
    // selectedProviderId: Provider;
    
  }, [selectedProviderId, setShowOperationConfirmationDialog]);

  const providers: Maybe<BackupProvider>[] = [
    {
      id: Provider.LOCAL,
      title: t('screens.backupRestore.providers.local'),
      icon: "file-download-outline",
      lastBackupAt: lastBackupLocalPreference?.value ? new Date(lastBackupLocalPreference?.value) : null,
    },
    null,
  ];

  const selectedProvider = providers.find(provider => provider?.id === selectedProviderId);

  return {
    error: null,
    loading: false,
    activeOperation,
    providers,
    selectedProvider,
    handleOperationDismiss,
    handleOperationConfirm,
    handleOperationChange,
    handleProviderPress,
    showOperationConfirmationDialog,
    t,
  }
}
