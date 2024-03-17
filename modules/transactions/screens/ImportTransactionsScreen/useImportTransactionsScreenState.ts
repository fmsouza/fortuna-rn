import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useReducer } from "react";
import * as DocumentPicker from 'expo-document-picker';

import { useAccount } from "~/modules/accounts/hooks";
import { Maybe } from "~/modules/shared/types";
import { readFile } from "~/modules/shared/utils";
import { useSaveTransactions } from "~/modules/transactions/hooks";
import { csvToTransactions } from "~/modules/transactions/transformers";
import { Transaction } from "~/modules/transactions/types";
import { aggregateUncategorizedTransactionsByTitle } from "~/modules/transactions/utils";
import { StandardTransactionCategory } from "~/modules/transactions/constants";


export function useImportTransactionsScreenState() {
  const router = useRouter();
  const { accountId } = useLocalSearchParams();
  const {account, loading: accountLoading, error: accountError} = useAccount(Number(accountId));
  const [state, dispatch] = useReducer(stateReducer, INITIAL_STATE);
  const {saveTransactions, loading: loadingTransactions, error: errorTransactions} = useSaveTransactions();

  const onPressAddAnotherTransaction = useCallback(() => {
    dispatch({type: ActionType.SHOW_UPSERT_TRANSACTION_MODAL});
  }, [dispatch]);

  const onPressImport = useCallback(async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({type: 'text/csv'});
      if (document.canceled) {
        return;
      }

      dispatch({type: ActionType.SET_LOADING_IMPORT_LOADING_STATE});

      const [{uri}] = document.assets;
      const fileContents = await readFile(uri);
      const trxns = await csvToTransactions(account!, fileContents);

      dispatch({type: ActionType.SAVE_IMPORTED_TRANSACTIONS, data: trxns});
    } catch (error) {
      console.error(error);
      dispatch({type: ActionType.SET_IMPORT_ERROR, data: error});
    }
  }, [account, dispatch, state]);

  const onDismissUpsertTransactionSheet = useCallback((trx?: Maybe<Partial<Transaction>>) => {
    if (!trx) {
      dispatch({type: ActionType.DISMISS_UPSERT_TRANSACTION_MODAL});
      return;
    }

    if (state.selectedTransactionIndex === -1) {
      dispatch({type: ActionType.ADD_TRANSACTION, data: trx});
    } else {
      dispatch({
        type: ActionType.UPDATE_TRANSACTION_AND_DISMISS_MODAL,
        data: {selectedTransactionIndex: state.selectedTransactionIndex, transaction: trx}
      });
    }
  }, [dispatch, state]);

  const onPressEditTransaction = useCallback((index: number) => {
    dispatch({type: ActionType.SHOW_UPSERT_TRANSACTION_MODAL, data: {selectedTransactionIndex: index}});
  }, [dispatch]);

  const onPressRemoveTransaction = useCallback((index: number) => {
    dispatch({type: ActionType.REMOVE_TRANSACTION_AND_DISMISS_MODAL, data: {selectedTransactionIndex: index}});
  }, [dispatch]);

  const onUpdateTransactionCategory = useCallback((index: number, categoryId: number) => {
    dispatch({type: ActionType.UPDATE_TRANSACTION_AND_DISMISS_MODAL, data: {selectedTransactionIndex: index, transaction: {categoryId}}});
  }, [dispatch]);

  const onPressReviewUncategorizedTransactions = useCallback(() => {
    dispatch({type: ActionType.SHOW_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL});
  }, [dispatch]);

  const onDismissReviewUncategorizedTransactions = useCallback((updates?: Maybe<Record<string, string>>) => {
    if (!updates) {
      dispatch({type: ActionType.DISMISS_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL});
      return;
    }

    const trxns = state.transactions.map(trx => {
      const updatedCategoryId = updates[trx.title!] ?? trx.categoryId;
      return {...trx, categoryId: updatedCategoryId};
    });
    
    dispatch({type: ActionType.UPDATE_TRANSACTIONS_AND_DISMISS_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL, data: {transactions: trxns}});
  }, [dispatch, state]);

  const onClose = useCallback(() => {
    router.back();
  }, [router]);

  const onSaveTransactions = useCallback(async () => {
    saveTransactions(state.transactions as Transaction[]);
    onClose();
  }, [saveTransactions, onClose, state]);

  const uncategorizedTransactionGroups = useMemo(() => aggregateUncategorizedTransactionsByTitle(state.transactions as Transaction[]), [state.transactions]);

  const loading = accountLoading || loadingTransactions || state.loadingImport;
  const error = (accountError || errorTransactions || state.importError) as Maybe<Error>;
  const canRemoveTransactions = state.transactions.length > 1;
  const selectedTransaction = state.selectedTransactionIndex >= 0 ? state.transactions[state.selectedTransactionIndex] : null;

  return {
    account,
    transactions: state.transactions,
    uncategorizedTransactionsCount: state.transactions.filter(trx => trx.categoryId === StandardTransactionCategory.OTHER).length,
    uncategorizedTransactionGroups,
    uncategorizedTransactionGroupsCount: Object.keys(uncategorizedTransactionGroups).length,
    loading,
    error,
    onPressImport,
    showUpsertTransactionSheet: state.showUpsertTransactionSheet,
    showUncategorizedTransactionsModal: state.showUncategorizedTransactionsModal,
    onPressAddAnotherTransaction,
    onDismissUpsertTransactionSheet,
    selectedTransaction,
    canRemoveTransactions,
    onPressEditTransaction,
    onPressRemoveTransaction,
    onUpdateTransactionCategory,
    onPressReviewUncategorizedTransactions,
    onDismissReviewUncategorizedTransactions,
    onSaveTransactions,
    onClose,
  };
};

const INITIAL_STATE = {
  selectedTransactionIndex: -1,
  showUpsertTransactionSheet: false,
  showUncategorizedTransactionsModal: false,
  loadingImport: false,
  importError: null,
  transactions: [] as Partial<Transaction>[],
};

enum ActionType {
  SET_LOADING_IMPORT_LOADING_STATE,
  ADD_TRANSACTION,
  SAVE_IMPORTED_TRANSACTIONS,
  SET_IMPORT_ERROR,
  SHOW_UPSERT_TRANSACTION_MODAL,
  SHOW_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL,
  DISMISS_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL,
  UPDATE_TRANSACTIONS_AND_DISMISS_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL,
  DISMISS_UPSERT_TRANSACTION_MODAL,
  UPDATE_TRANSACTION_AND_DISMISS_MODAL,
  REMOVE_TRANSACTION_AND_DISMISS_MODAL,
}

function stateReducer(state: typeof INITIAL_STATE, action: {type: ActionType; data?: any}): typeof INITIAL_STATE {
  switch (action.type) {
    case ActionType.SET_LOADING_IMPORT_LOADING_STATE: {
      return { ...state, loadingImport: true};
    }

    case ActionType.ADD_TRANSACTION: {
      return {...state, transactions: [...state.transactions, action.data]};
    }

    case ActionType.SAVE_IMPORTED_TRANSACTIONS: {
      return {
        ...state,
        loadingImport: false,
        transactions: action.data,
      };
    }

    case ActionType.SET_IMPORT_ERROR: {
      return {
        ...state,
        loadingImport: false,
        importError: action.data,
      };
    }

    case ActionType.SHOW_UPSERT_TRANSACTION_MODAL: {
      const {selectedTransactionIndex} = action.data ?? {};
      return {
        ...state,
        selectedTransactionIndex: selectedTransactionIndex ?? -1,
        showUpsertTransactionSheet: true
      };
    }

    case ActionType.DISMISS_UPSERT_TRANSACTION_MODAL: {
      return {
        ...state,
        selectedTransactionIndex: -1,
        showUpsertTransactionSheet: false,
      };
    }

    case ActionType.SHOW_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL: {
      return {...state, showUncategorizedTransactionsModal: true};
    }

    case ActionType.DISMISS_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL: {
      return {...state, showUncategorizedTransactionsModal: false};
    }

    case ActionType.UPDATE_TRANSACTIONS_AND_DISMISS_REVIEW_UNCATEGORIZED_TRANSACTIONS_MODAL: {
      const {transactions} = action.data;
      return {
        ...state,
        showUncategorizedTransactionsModal: false,
        transactions,
      };
    }

    case ActionType.UPDATE_TRANSACTION_AND_DISMISS_MODAL: {
      const {selectedTransactionIndex, transaction} = action.data;
      return {
        ...state,
        selectedTransactionIndex: -1,
        showUpsertTransactionSheet: false,
        transactions: state.transactions.map((t, i) => i === selectedTransactionIndex ? {...t, ...transaction} : t),
      };
    }

    case ActionType.REMOVE_TRANSACTION_AND_DISMISS_MODAL: {
      const {selectedTransactionIndex} = action.data;
      return {
        ...state,
        selectedTransactionIndex: -1,
        showUpsertTransactionSheet: false,
        transactions: state.transactions.filter((_, i) => i !== selectedTransactionIndex),
      };
    }

    default:
      return state;
  }
}