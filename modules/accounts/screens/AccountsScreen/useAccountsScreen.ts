import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";
import { useAccounts, useRemoveAccount } from "~/modules/accounts/hooks";

export function useAccountsScreen() {
  const router = useRouter();
  const { accounts, error: accountsError, loading: accountsLoading } = useAccounts();
  const { removeAccount, error: removeAccountError, loading: removeAccountLoading } = useRemoveAccount();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Maybe<Account>>(null);

  const handleEditPress = useCallback((account: Account) => {
    router.push(`/account/${account.id}/edit`);
  }, [router]);

  const handleDeletePress = useCallback((account: Account) => {
    setSelectedAccount(account);
    setShowDeleteConfirmation(true);
  } , [setSelectedAccount, setShowDeleteConfirmation]);

  const handleDismissDeleteConfirmation = useCallback(() => {
    setShowDeleteConfirmation(false);
    setSelectedAccount(null);
  }, [setShowDeleteConfirmation, setSelectedAccount]);

  const handleConfirmDelete = useCallback(() => {
    if (selectedAccount) {
      removeAccount(selectedAccount);
    }
    handleDismissDeleteConfirmation();
  }, [selectedAccount, handleDismissDeleteConfirmation]);

  const loading = accountsLoading || removeAccountLoading;
  const error = accountsError || removeAccountError;

  return {
    accounts,
    loading,
    error,
    showDeleteConfirmation,
    handleEditPress,
    handleDeletePress,
    handleConfirmDelete,
    handleDismissDeleteConfirmation,
  };
}