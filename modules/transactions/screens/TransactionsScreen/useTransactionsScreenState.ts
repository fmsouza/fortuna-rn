import { useCallback, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { Maybe } from "~/modules/shared/types";
import { useAccount } from "~/modules/accounts/hooks";
import { periodToDateInterval } from "~/modules/accounts/utils";
import { Transaction } from "~/modules/transactions/types";
import { useChangeTransactionCategory, useRemoveTransaction, useTransactions, useUpdateTransaction } from "~/modules/transactions/hooks";
import { aggregateUncategorizedTransactionsByTitle } from "~/modules/transactions/utils";
import { StandardTransactionCategory } from "~/modules/transactions/constants";

export function useTransactionsScreenState() {
  const params = useLocalSearchParams();
  const accountId = Number(params.accountId);
  const period = params.period ? new Date(params.period as string) : null;

  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [showUncategorizedTransactionsModal, setShowUncategorizedTransactionsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Maybe<Transaction>>(null);
  const {removeTransaction, loading: removeTransactionLoading, error: removeTransactionError} = useRemoveTransaction();
  const {changeTransactionCategory, loading: changeTransactionCategoryLoading, error: changeTransactionCategoryError} = useChangeTransactionCategory();
  const {updateTransaction, loading: updateTransactionLoading, error: updateTransactionError} = useUpdateTransaction();
  const {account, loading: accountLoading, error: accountError} = useAccount(accountId);
  const {transactions, loading: transactionsLoading, error: transactionsError} = useTransactions({
    accountId,
    dates: period ? periodToDateInterval(period) : undefined,
  });

  const onChangeTransactionCategory = useCallback(async (transaction: Transaction, newCategoryId: ID) => {
    await changeTransactionCategory({ transaction, categoryId: newCategoryId });
  }, [changeTransactionCategory]);

  const onPressEditTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditTransactionModal(true);
  }, [setSelectedTransaction, setShowEditTransactionModal]);

  const handleDismissEditTransactionModal = useCallback(async (trx?: Maybe<Partial<Transaction>>) => {
    if (trx) {
      await updateTransaction(trx as Transaction);
    }
    setShowEditTransactionModal(false);
    setSelectedTransaction(null);
  }, [updateTransaction, setShowEditTransactionModal, setSelectedTransaction]);

  const onPressRemoveTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowRemoveAlert(true);
  }, [setShowRemoveAlert, setSelectedTransaction]);

  const handleDismissRemoveAlert = useCallback(() => {
    setShowRemoveAlert(false);
    setSelectedTransaction(null);
  }, [setShowRemoveAlert, setSelectedTransaction]);

  const handleRemoveSelectedTransaction = useCallback(async () => {
    if (!selectedTransaction) {
      return;
    }

    await removeTransaction(selectedTransaction);
    setShowRemoveAlert(false);
    setSelectedTransaction(null);
  }, [removeTransaction, setShowRemoveAlert, setSelectedTransaction, selectedTransaction]);

  const onPressUncategorizedTransactions = useCallback(() => {
    setShowUncategorizedTransactionsModal(true);
  }, [setShowUncategorizedTransactionsModal]);

  const handleDismissUncategorizedTransactionsModal = useCallback(async (updates?: Maybe<Record<string, number>>) => {
    if (!updates) {
      return;
    }

    await Promise.all(
      Object.entries(updates).map(([title, categoryId]) => {
        const transaction = transactions.find(trx => trx.title === title);
        if (!transaction) {
          return;
        }
  
        return changeTransactionCategory({ transaction, categoryId });
      })
    );

    setShowUncategorizedTransactionsModal(false);
  }, [changeTransactionCategory, setShowUncategorizedTransactionsModal, transactions]);

  const error = accountError || transactionsError || removeTransactionError || changeTransactionCategoryError || updateTransactionError;
  const loading = accountLoading || transactionsLoading || removeTransactionLoading || changeTransactionCategoryLoading || updateTransactionLoading;

  const uncategorizedTransactionsCount = transactions.filter(trx => trx.categoryId === StandardTransactionCategory.OTHER).length;
  const uncategorizedTransactionGroups = useMemo(() => aggregateUncategorizedTransactionsByTitle(transactions as Transaction[]), [transactions]);

  return {
    account,
    transactions,
    loading,
    error,
    selectedTransaction,
    uncategorizedTransactionsCount,
    uncategorizedTransactionGroups,
    showRemoveAlert,
    onChangeTransactionCategory,
    onPressEditTransaction,
    showEditTransactionModal,
    handleDismissEditTransactionModal,
    onPressRemoveTransaction,
    handleDismissRemoveAlert,
    handleRemoveSelectedTransaction,
    showUncategorizedTransactionsModal,
    onPressUncategorizedTransactions,
    handleDismissUncategorizedTransactionsModal,
  };
}
