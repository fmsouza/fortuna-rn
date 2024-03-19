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
  const params = useLocalSearchParams();
  const accountId = Number(params.accountId);
  const [currentPeriod, setCurrentPeriod] = useState<Maybe<Date>>(null);
  const {account, loading: accountLoading, error: accountError} = useAccount(accountId);
  const {periods: trxPeriods, loading: periodsLoading, error: periodsError} = useTransactionPeriods(accountId);
  const {transactions, loading: transactionsLoading, error: transactionsError} = useTransactions({
    accountId: Number(accountId),
    dates: currentPeriod ? periodToDateInterval(currentPeriod) : undefined,
  });

  const handleChangePeriod = useCallback((period: Maybe<string>) => {
    if (!period) return;
    if (period === 'all') return setCurrentPeriod(null);
    setCurrentPeriod(new Date(period));
  }, [setCurrentPeriod]);

  const handlePressAddTransactions = useCallback(() => {
    router.push(`/import-transactions/${accountId}`);
  }, [router]);

  const error = accountError || transactionsError || periodsError;
  const loading = accountLoading || transactionsLoading || periodsLoading;
  const canShowPeriods = account && trxPeriods?.length > 0;

  const datePeriods = trxPeriods?.map((period: Date) => ({
    label: periodLabel(period),
    value: period.toISOString(),
  })) ?? [];

  const periods = datePeriods.length > 0 ? [{label: 'All', value: 'all'}, ...datePeriods] : [];

  return {
    account,
    error,
    loading,
    periods,
    showPeriods: canShowPeriods,
    transactions,
    currentPeriod,
    handleChangePeriod,
    handlePressAddTransactions,
  };
};
