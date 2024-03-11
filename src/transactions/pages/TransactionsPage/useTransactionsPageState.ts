import { useCallback, useMemo, useState } from "react";

import { useAccount } from "~/accounts/hooks";
import { periodToDateInterval } from "~/accounts/utils";
import { ID, Maybe } from "~/shared/types";
import { useChangeTransactionCategory, useRemoveTransaction, useTransactions, useUpdateTransaction } from "~/transactions/hooks";
import { Transaction } from "~/transactions/types";
import { aggregateUncategorizedTransactionsByTitle } from "~/transactions/utils";

type UseTransactionsPageStateInput = {
  accountId: ID;
  period?: Maybe<Date>;
};

export const useTransactionsPageState = ({ accountId, period }: UseTransactionsPageStateInput) => {
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

  const handleDismissUncategorizedTransactionsModal = useCallback(async (updates?: Maybe<Record<string, string>>) => {
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

  const uncategorizedTransactionsCount = transactions.filter(trx => trx.categoryId === 'other').length;
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
};
