import { useCallback, useState } from "react"

import { useText } from "~/intl";
import { Maybe } from "~/modules/shared/types";
import { useAppPreference, useSaveAppPreference } from "~/modules/settings/hooks";
import { AppPreferences } from "~/modules/settings/constants";
import { set } from "lodash";

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
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<Maybe<Error>>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<Maybe<Provider>>(null);
  const [showOperationConfirmationDialog, setShowOperationConfirmationDialog] = useState(false);
  const { appPreference: lastBackupLocalPreference } = useAppPreference(AppPreferences.LAST_BACKUP_LOCAL);
  const { saveAppPreference, error: saveError, loading: saveLoading } = useSaveAppPreference();

  const error = operationError || saveError;
  const loading = operationLoading || saveLoading;

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

  const handleOperationConfirm = useCallback(async () => {
    setShowOperationConfirmationDialog(false);
    setOperationLoading(true);
    setOperationError(null);

    switch (true) {

      default:
      case activeOperation === Operation.RESTORE && !selectedProvider?.lastBackupAt: {
        break;
      }

      case activeOperation === Operation.BACKUP && selectedProvider?.id === Provider.LOCAL: {
        // TODO: Implement backup logic
        // saveAppPreference({
        //   id: AppPreferences.LAST_BACKUP_LOCAL,
        //   value: new Date().toISOString(),
        // });
        break;
      }

      case activeOperation === Operation.RESTORE && selectedProvider?.id === Provider.LOCAL: {
        // TODO: Implement restore logic
        break;
      }

    }
    setOperationLoading(false);
    
  }, [activeOperation, saveAppPreference, selectedProviderId, setShowOperationConfirmationDialog]);

  return {
    error,
    loading,
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
