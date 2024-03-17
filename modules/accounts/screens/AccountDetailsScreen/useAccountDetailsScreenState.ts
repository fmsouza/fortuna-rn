import { useCallback, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import dayjs from "dayjs";

import { Maybe } from "~/modules/shared/types";
import { useAccount } from "~/modules/accounts/hooks";
import { periodToDateInterval } from "~/modules/accounts/utils";
import { useTransactionPeriods, useTransactions } from "~/modules/transactions/hooks";

const periodLabel = (period: Date): string => {
  return dayjs(period).format('MMM YYYY');
};

export const useAccountDetailsScreenState = () => {
  const router = useRouter();
  const { accountId } = useLocalSearchParams();
  const [currentPeriod, setCurrentPeriod] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const {account, loading: accountLoading, error: accountError} = useAccount(Number(accountId));
  const {periods: trxPeriods, loading: periodsLoading, error: periodsError} = useTransactionPeriods(Number(accountId));
  const {transactions, loading: transactionsLoading, error: transactionsError} = useTransactions({
    accountId: Number(accountId),
    dates: currentPeriod ? periodToDateInterval(currentPeriod) : undefined,
  });

  const handleChangePeriod = useCallback((period: Maybe<string>) => {
    if (!period) return;
    setCurrentPeriod(new Date(period));
  }, [setCurrentPeriod]);

  const handlePressAddTransactions = useCallback(() => {
    router.push(`/import-transactions/${accountId}`);
  }, [router]);

  const error = accountError || transactionsError || periodsError;
  const loading = accountLoading || transactionsLoading || periodsLoading;
  const canShowPeriods = account && trxPeriods?.length > 0;
  const canShowList = account && !loading && !error;

  const periods = trxPeriods?.map((period: Date) => ({
    label: periodLabel(period),
    value: period.toISOString(),
  }));

  return {
    account,
    error,
    loading,
    periods,
    showList: canShowList,
    showPeriods: canShowPeriods,
    transactions,
    currentPeriod,
    handleChangePeriod,
    handlePressAddTransactions,
  };
};
